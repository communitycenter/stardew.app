# Purpose: Scraping museum artifact information from sdv wiki
# Result is saved to data/museum.json
# { artifacts: { name: { itemID, locations } }, minerals: { name: { itemID, locations } }
#
# Content Files used: Objects.json, Strings/Objects.json
# Wiki Pages used: https://stardewvalleywiki.com/Artifacts, https://stardewvalleywiki.com/Minerals

import re
import requests
import unicodedata

from tqdm import tqdm
from bs4.element import Tag
from bs4 import BeautifulSoup, ResultSet

from helpers.models import ContentObjectModel, MuseumPiece
from helpers.utils import load_content, save_json, get_string, load_strings

# load the content files
OBJECTS: dict[str, ContentObjectModel] = load_content("Objects.json")
OBJ_STRINGS = load_strings("Objects.json")


# build a map of name -> itemID from objects
def build_item_map() -> dict[str, int]:
    item_map = {}

    for key, value in OBJECTS.items():
        display_name = get_string(value["DisplayName"])
        item_map[display_name] = key

    return item_map


def clean(text: str) -> str:
    """Remove superscripted references from text, and normalize"""
    return unicodedata.normalize("NFKD", re.sub(r"\[\d+\]", "", text))


# ---------------------------------------------------------------------------- #
#                                   artifacts                                  #
# ---------------------------------------------------------------------------- #
dolls = {
    "Strange Doll (green)": "126",
    "Strange Doll (yellow)": "127",
}


def get_artifacts() -> dict[str, MuseumPiece]:
    URL = "https://stardewvalleywiki.com/Artifacts"
    page = requests.get(URL)
    soup = BeautifulSoup(page.text, "html.parser")

    name_to_itemID = build_item_map()

    # find the tbody element containing the information. We'll use the XPath from
    # chrome's dev tools to find it. Right click the element -> Copy -> Copy XPath
    # Result: //*[@id="mw-content-text"]/div/table[1]/tbody
    tbody = (
        soup.find("div", {"id": "mw-content-text"})
        .find("div")
        .find("table")
        .find("tbody")
    )

    artifacts: dict[str, MuseumPiece] = {}
    # skip the first row because it's the table header for some reason
    tr: Tag
    for tr in tqdm(tbody.find_all("tr")[1:], desc="Artifacts"):
        fields: ResultSet[Tag] = tr.find_all("td")

        name = fields[1].find("a").get("title").strip()

        if name in dolls:
            itemID = dolls[name]
        else:
            itemID = name_to_itemID.get(name)

        if itemID is None:
            print(f"Could not find itemID for artifact: {name}")
            continue

        # get all the text in the 5th column in which each location is an <li>
        # element, so we'll go through each and get the text
        locations = []
        for li in fields[4].find_all("li"):
            text = clean(li.get_text().strip())
            locations.append(text)

        artifacts[itemID] = {
            "itemID": itemID,
            "locations": locations,
        }

    return artifacts


# ---------------------------------------------------------------------------- #
#                                   minerals                                   #
# ---------------------------------------------------------------------------- #
def get_minerals() -> dict[str, MuseumPiece]:
    URL = "https://stardewvalleywiki.com/Minerals"
    page = requests.get(URL)
    soup = BeautifulSoup(page.text, "html.parser")

    name_to_itemID = build_item_map()

    # The tables are split into 3 tables of different sections (The 4th is geodes)
    # they all have the same class names: wikitable sortable roundedborder so,
    # we'll use a CSS selector to find them (Dev Tools -> Copy -> Copy Selector)
    css_selector = "#mw-content-text > div > table.wikitable.sortable.roundedborder"
    tables = soup.select(css_selector)

    table_num = 0
    minerals: dict[str, MuseumPiece] = {}
    for table in tqdm(tables[:3], desc="Minerals"):
        # skip the first row because it's the table header for some reason
        tr: Tag
        for tr in table.find_all("tr")[1:]:
            fields: ResultSet[Tag] = tr.find_all("td")

            name = fields[1].find("a").get("title").strip()
            itemID = name_to_itemID.get(name)

            if itemID is None:
                print(f"Could not find itemID for mineral: {name}")
                continue

            # The first table has a different format for locations. The first
            # row in locations is usually the mine and what levels but they're not
            # in a grouped element so we'll have to do some extra work to get them
            locations = []
            if table_num == 0:
                first_a = fields[5].find("a")
                next_text = first_a.next_sibling

                # get the text of the first <a> element
                locations.append(first_a.get("title") + next_text)

            # the rest of the locations are in a <span> element with class "nametemplate"
            # so we'll get all of those and get the text
            spans: ResultSet[Tag] = fields[5].find_all(
                "span", {"class": "nametemplate"}
            )
            for span in spans:
                text = span.get_text().strip()
                text = unicodedata.normalize("NFKD", text)
                locations.append(text)

                # remove the span element from the html, to later find extra text
                span.decompose()

            # check if there's any extra text after the span element
            next_text = fields[5].get_text().strip()
            if next_text:
                locations.append(unicodedata.normalize("NFKD", next_text))

            minerals[itemID] = {
                "itemID": itemID,
                "locations": locations,
            }
        table_num += 1

    return minerals


if __name__ == "__main__":
    artifacts = get_artifacts()
    minerals = get_minerals()

    # make sure we have all the artifacts and minerals, found by looking at the wiki
    # https://stardewvalleywiki.com/Museum
    assert len(artifacts) == 42
    assert len(minerals) == 53

    museum = {"artifacts": artifacts, "minerals": minerals}
    save_json(museum, "museum.json", sort=True)

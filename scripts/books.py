# Purpose: Scraping book information from the sdv wiki (Power Books and Skill Books)
# Result is saved to data/books.json
# { itemID: { itemID, name, description, subsequentReading, locations, type, minVersion } }
#
# Content Files used: none directly (cross-referenced against src/data/objects.json)
# Wiki Pages used: https://stardewvalleywiki.com/Books

import re
import requests
import unicodedata

from tqdm import tqdm
from bs4.element import Tag
from bs4 import BeautifulSoup, ResultSet

from helpers.models import Book, Object
from helpers.utils import load_data, save_json

# load the already-parsed objects data so we can cross-reference book names -> itemIDs
DATA_OBJECTS: dict[str, Object] = load_data("objects.json")

# the wiki hides the raw sort value used by its tables in a "display: none" span,
# which shows up as literal text (ex: `data-sort-value="3000">`) when scraped, so
# we need to strip those spans out before reading a cell's text
HIDDEN_SPAN_STYLE = re.compile(r"display:\s*none")


def build_book_map() -> dict[str, str]:
    """Builds a map of book display name -> itemID for all Book/Skill Book objects"""
    book_map = {}

    for itemID, obj in DATA_OBJECTS.items():
        if obj.get("category") in ("Book", "Skill Book"):
            book_map[obj["name"]] = itemID

    return book_map


def clean(text: str) -> str:
    """Removes superscripted references and extra whitespace from text, and normalizes"""
    text = re.sub(r"\[\d+\]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    # get_text(separator=" ") adds a space between adjacent tags/text even when
    # there wasn't one in the original markup (ex: "<a>Lewis</a>' house")
    text = re.sub(r"\s+([.,;:'])", r"\1", text)
    return unicodedata.normalize("NFKD", text)


def cell_text(td: Tag) -> str:
    """Gets the cleaned display text of a table cell, ignoring hidden sort-value spans"""
    for span in td.find_all("span", style=HIDDEN_SPAN_STYLE):
        span.decompose()
    return clean(td.get_text(separator=" ", strip=True))


def cell_locations(td: Tag) -> list[str]:
    """Gets the list of locations/sources from a table cell's <li> elements"""
    for span in td.find_all("span", style=HIDDEN_SPAN_STYLE):
        span.decompose()
    return [clean(li.get_text(separator=" ", strip=True)) for li in td.find_all("li")]


# ---------------------------------------------------------------------------- #
#                                    books                                     #
# ---------------------------------------------------------------------------- #
def parse_table(
    table: Tag, book_type: str, has_subsequent_reading: bool
) -> dict[str, Book]:
    name_to_itemID = build_book_map()

    books: dict[str, Book] = {}
    # skip the first row because it's the table header
    tr: Tag
    for tr in tqdm(table.find_all("tr")[1:], desc=book_type):
        fields: ResultSet[Tag] = tr.find_all("td")

        name = clean(fields[1].get_text(strip=True))
        itemID = name_to_itemID.get(name)

        if itemID is None:
            print(f"Could not find itemID for book: {name}")
            continue

        description = cell_text(fields[2])

        if has_subsequent_reading:
            subsequent_reading = cell_text(fields[3])
            locations = cell_locations(fields[4])
        else:
            subsequent_reading = None
            locations = cell_locations(fields[3])

        books[itemID] = {
            "itemID": itemID,
            "name": name,
            "description": description,
            "subsequentReading": subsequent_reading,
            "locations": locations,
            "type": book_type,
            "minVersion": DATA_OBJECTS[itemID]["minVersion"],
        }

    return books


def get_books() -> dict[str, Book]:
    URL = "https://stardewvalleywiki.com/Books"
    page = requests.get(URL)
    soup = BeautifulSoup(page.text, "html.parser")

    # find the two wikitables on the page. We'll use the CSS selector from
    # chrome's dev tools to find them. Right click the element -> Copy -> Copy selector
    # Result: #mw-content-text > div > table.wikitable.sortable
    tables = soup.select("#mw-content-text > div > table.wikitable.sortable")

    # the first table is "Power Books" (has a "Subsequent reading" column), and
    # the second table is "Skill Books" (no "Subsequent reading" column)
    power_books = parse_table(tables[0], "Power Book", has_subsequent_reading=True)
    skill_books = parse_table(tables[1], "Skill Book", has_subsequent_reading=False)

    return {**power_books, **skill_books}


if __name__ == "__main__":
    books = get_books()

    # as of 1.6, there are 19 power books and 7 skill books
    # https://stardewvalleywiki.com/Books
    assert len(books) == 19 + 7

    save_json(books, "books.json", sort=True)

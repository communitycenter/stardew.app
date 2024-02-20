# Purpose: Get relevant information on all villagers including their birthday,
#          gift tastes (only loves for now scraped from wiki), and whether they are datable.
# Content Files used: Characters.json, Strings/NPCNames.json
# Wiki Pages used: stardewvalleywiki.com/<npc_name>

import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.utils import load_content, save_json, load_strings, load_data, get_string
from helpers.models import Villager, ContentCharacterModel, Object

# load the content files
CHARACTERS: dict[str, ContentCharacterModel] = load_content("Characters.json")
NPC_NAMES: dict[str, str] = load_strings("NPCNames.json")
OBJECTS: dict[str, Object] = load_data("objects.json")


def can_socialize(character: ContentCharacterModel) -> bool:
    if character.get("CanSocialize") == "FALSE":
        return False

    return character.get("PerfectionScore")


def build_names_to_ids() -> dict[str, str]:
    # create a mapping of names to ids for the loves data
    output: dict[str, str] = {}

    for k, v in OBJECTS.items():
        output[v["name"]] = int(k)

    return output


def get_villagers() -> dict[str, Villager]:
    output: dict[str, Villager] = {}

    names_to_ids = build_names_to_ids()

    for k, v in tqdm(CHARACTERS.items()):
        # skip characters that you can't build a relationship with
        if not can_socialize(v):
            continue

        name = get_string(v["DisplayName"], NPC_NAMES)
        datable = v.get("CanBeRomanced", False)
        birthday = v.get("BirthSeason") + " " + str(v.get("BirthDay"))

        # get icon URL from the wiki page containing the file
        wiki_file_url = f"https://stardewvalleywiki.com/File:{name}.png"
        page = requests.get(wiki_file_url)
        soup = BeautifulSoup(page.text, "html.parser")
        iconURL = soup.select_one("#file > a > img").get("src")

        # get the loves data from the wiki page
        wiki_url = f"https://stardewvalleywiki.com/{name}"
        page = requests.get(wiki_url)
        soup = BeautifulSoup(page.text, "html.parser")
        loves = []

        wiki_td = soup.select("#infoboxdetail")[-1]
        loves_names = wiki_td.get_text(separator="|", strip=True).split("|")

        for l in loves_names:
            if l in names_to_ids:
                loves.append(names_to_ids[l])

            else:
                print(f"Could not find {l} in names_to_ids")

        output[k] = {
            "name": name,
            "birthday": birthday,
            "datable": datable,
            "iconURL": f"https://stardewvalleywiki.com{iconURL}",
            "loves": sorted(loves),
        }

    return output


if __name__ == "__main__":
    villagers = get_villagers()

    assert len(villagers) == 34

    save_json(villagers, "villagers.json", sort=False)

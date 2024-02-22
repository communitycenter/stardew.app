# Purpose: Gather all information about fish needed to complete the fishing achievements.
#          Logic is mainly ported from the game's source code to decide which fish don't count.
#          see StardewValley/Stats.cs::checkForFishingAchievements()
# Result is saved to data/fish.json
#
# Content Files used: Fish.json, Objects.json,
# Wiki Pages used: https://stardewvalleywiki.com/<fish_name>

import requests

from tqdm import tqdm
from bs4.element import Tag
from bs4 import BeautifulSoup

from helpers.models import Fish, TrapFish, ContentObjectModel
from helpers.utils import load_content, save_json, convert_time

# Load the content files
FISH: dict[str, str] = load_content("Fish.json")
OBJECTS: dict[str, ContentObjectModel] = load_content("Objects.json")

LEGENDARY_FISH = {
    "159": {  # Crimsonfish
        "seasons": ["Summer"],
        "min_level": "5",
        "locations": ["East Pier on The Beach"],
    },
    "160": {  # Angler
        "seasons": ["Fall"],
        "min_level": "3",
        "locations": ["North of JojaMart on the wooden plank bridge"],
    },
    "163": {  # Legend
        "seasons": ["Spring"],
        "min_level": "10",
        "locations": ["The Mountain Lake, near the log"],
    },
    "682": {  # Mutant Carp
        "seasons": ["Spring", "Summer", "Fall", "Winter"],
        "min_level": "0",
        "locations": ["The Sewers"],
    },
    "775": {  # Glacierfish
        "seasons": ["Winter"],
        "min_level": "6",
        "locations": ["South end of Arrowhead Island in Cindersap Forest"],
    },
}


def get_fish() -> dict[str, Fish | TrapFish]:
    output: dict[str, Fish | TrapFish] = {}

    for k, v in tqdm(OBJECTS.items()):
        if v.get("Type") == "Fish" and not v.get("ExcludeFromFishingCollection"):
            # get the fields from Fish.json

            fish_fields = FISH.get(k).split("/")

            name = v.get("Name")

            wiki_url = f"https://stardewvalleywiki.com/{name.replace(' ', '_')}"
            page = requests.get(wiki_url)
            soup = BeautifulSoup(page.text, "html.parser")

            # find the locations from the wiki
            tag: Tag = soup.find_all("td", {"id": "infoboxdetail"})[1]
            # trap fish and other non-fish items like seaweed have different formatting
            if fish_fields[1] == "trap" or v.get("Category") == 0:

                locations = tag.get_text().strip().split("\n")
            else:
                locations = tag.get_text().strip().split(" • ")

            # return for trap fish since there's no other data to gather
            if fish_fields[1] == "trap":
                output[k] = {
                    "itemID": int(k),
                    "locations": locations,
                    "trapFish": True,
                }
                continue

            # hardcoded checks for legendary fish
            # there's some differences between Fish.json and the real behavior of the fish
            if k in LEGENDARY_FISH:
                start_time = "6AM"
                end_time = "2AM"
                seasons = LEGENDARY_FISH[k]["seasons"]
                min_level = int(LEGENDARY_FISH[k]["min_level"])
                locations = LEGENDARY_FISH[k]["locations"]
            else:
                start_time = convert_time(fish_fields[5].split(" ")[0])
                end_time = convert_time(fish_fields[5].split(" ")[1])
                seasons = fish_fields[6].split(" ")
                min_level = int(fish_fields[12])

            difficulty = f"{fish_fields[1]} {fish_fields[2]}"
            time = f"{start_time} - {end_time}"
            weather = fish_fields[7]

            output[k] = {
                "itemID": int(k),
                "locations": locations,
                "trapFish": False,
                "difficulty": difficulty,
                "time": time,
                "seasons": [s.capitalize() for s in seasons],
                "weather": weather.capitalize(),
                "minLevel": min_level,
            }

    return output


if __name__ == "__main__":
    fish = get_fish()

    assert len(fish) == 67
    assert len([f for f in fish.values() if f.get("trapFish")]) == 9  # trap fish
    assert len([f for f in fish.values() if not f.get("trapFish")]) == 58  # trap fish
    save_json(fish, "fish.json", sort=True)

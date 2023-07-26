# Parsing all fishing data from game files
# ! Run file from processors directory

import json
import requests

from tqdm import tqdm
from datetime import datetime
from bs4 import BeautifulSoup

fish = {}

# took a bit of inspection to figure out which fish don't count.
# Clam is a "Basic" category in ObjectInformation.json, the keys 898 - 902
# are the fish that don't count towards the fishing achievements (Legendary II)
# See StardewValley.Stats::checkForFishingAchievements()
# https://github.com/veywrn/StardewValley/blob/3ff171b6e9e6839555d7881a391b624ccd820a83/StardewValley/Stats.cs#L964


def upper_first(s: str) -> str:
    return s[0].upper() + s[1:]


def convert_time(time: str) -> str:
    return datetime.strptime(time, "%H%M%S").strftime("%-I%p")


with open("../raw_data/Fish.json") as f:
    fish_data = json.load(f)

with open("../raw_data/ObjectInformation.json") as f:
    object_info = json.load(f)

for key, value in tqdm(object_info.items()):
    # we gonna follow more of the checkForFishingAchievements() logic
    fields = value.split("/")

    if (
        ("Fish" in fields[3])
        and (int(key) < 167 or int(key) > 172)
        and (int(key) < 898 or int(key) > 902)
    ):
        # fields from Fish.json
        fish_fields = fish_data[key].split("/")

        name = fields[0]

        wiki_url = f"https://stardewvalleywiki.com/{name.replace(' ', '_')}"
        page = requests.get(wiki_url)
        soup = BeautifulSoup(page.text, "html.parser")

        # find the locations
        if fish_fields[1] == "trap" or len(fields[3].split(" ")) < 2:
            locations = (
                soup.find_all("td", {"id": "infoboxdetail"})[1].text.strip().split("\n")
            )
        else:
            locations = (
                soup.find_all("td", {"id": "infoboxdetail"})[1]
                .text.strip()
                .split(" • ")
            )

        # return for trap fish, no further info
        if fish_fields[1] == "trap":
            fish[key] = {
                "itemID": int(key),
                "locations": locations,
                "trapFish": True,
            }
            continue

        start_time = convert_time(fish_fields[5].split(" ")[0])
        end_time = convert_time(fish_fields[5].split(" ")[1])

        difficulty = f"{fish_fields[1]} {fish_fields[2]}"
        time = f"{start_time} - {end_time}"
        seasons = fish_fields[6].split(" ")
        weather = fish_fields[7]
        min_level = fish_fields[12]

        fish[key] = {
            "itemID": int(key),
            "locations": locations,
            "trapFish": False,
            "difficulty": difficulty,
            "time": time,
            "seasons": [upper_first(season) for season in seasons],
            "weather": upper_first(weather),
            "minLevel": min_level,
        }

# json.dump(fish, f, indent=4) for pretty printing
with open("../../data/fish.json", "w") as f:
    json.dump(fish, f, separators=(",", ":"))

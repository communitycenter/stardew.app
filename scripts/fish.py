# Purpose: Gather all information about fish needed to complete the fishing achievements.
#          Logic is mainly ported from the game's source code to decide which fish don't count.
#          see StardewValley/Stats.cs::checkForFishingAchievements() or
#          StardewValley/Utility.cs::getFishCaughtPercent()
# Result is saved to data/fish.json
#
# Content Files used: Fish.json, Objects.json, Locations.json
# Wiki Pages used: https://stardewvalleywiki.com/<fish_name>

import requests

from tqdm import tqdm
from bs4.element import Tag
from bs4 import BeautifulSoup

from helpers.models import Fish, TrapFish, ContentObjectModel, Object
from helpers.utils import load_content, save_json, convert_time, load_data, get_string, get_fish_info

# Load the content files
FISH: dict[str, str] = load_content("Fish.json")
OBJECTS: dict[str, ContentObjectModel] = load_content("Objects.json")
DATA_OBJECTS: dict[str, Object] = load_data("objects.json")
LOCATIONS: dict[str, str] = load_content("Locations.json")

LEGENDARY_FISH = {
    "159": {  # Crimsonfish
        "seasons": ["Summer"],
        "locations": ["East Pier on The Beach"],
    },
    "160": {  # Angler
        "seasons": ["Fall"],
        "locations": ["North of JojaMart on the wooden plank bridge"],
    },
    "163": {  # Legend
        "seasons": ["Spring"],
        "locations": ["The Mountain Lake, near the log"],
    },
    "682": {  # Mutant Carp
        "seasons": ["Spring", "Summer", "Fall", "Winter"],
        "locations": ["The Sewers"],
    },
    "775": {  # Glacierfish
        "seasons": ["Winter"],
        "locations": ["South end of Arrowhead Island in Cindersap Forest"],
    },
}

# Fish that count for fishing achievements but are not in Fish.json
# 1.6 added new fish which don't trigger a mini-game and are not in Fish.json
# For now, we'll just add them manually since the wiki doesn't have the data yet
FISH_NONFISH = {
    "SeaJelly": {
        "locations": [
            "Ocean",
            "Ginger Island",
            "Submarine at Night Market",
            "Pirate Cove",
        ],
    },
    "CaveJelly": {
        "locations": ["The Mines"],
    },
    # TODO: verify these locations because some FishAreaIds are null so they might not actually spawn
    # EX: Desert has FishAreaId TopPond or BottomPond, but it's null for RiverJelly
    "RiverJelly": {
        "locations": [
            "River",
            "Mountain Lake",
            "Forest River",
            "The Desert",
            "Secret Woods",
            "Ginger Island North & West (freshwater)",
        ],
    },
}

def get_fish() -> dict[str, Fish | TrapFish]:
    output: dict[str, Fish | TrapFish] = {}

    for k, v in tqdm(OBJECTS.items()):

        if v.get("Type") == "Fish" and not v.get("ExcludeFromFishingCollection"):

            minVersion = DATA_OBJECTS[k]["minVersion"]

            if k in FISH_NONFISH:
                output[k] = {
                    "difficulty": "None",
                    "itemID": k,
                    "locations": FISH_NONFISH[k]["locations"],
                    "minLevel": 0,
                    "minVersion": minVersion,
                    "seasons": ["Spring", "Summer", "Fall", "Winter"],
                    "time": "6AM - 2AM",
                    "trapFish": False,
                    "weather": "Both",
                }
                continue

            # get the fields from Fish.json
            fish_fields = FISH.get(k).split("/")

            name = get_string(v["DisplayName"])
            if name != v["Name"]:
                print(f"Name mismatch: {name} vs {v['Name']}")

            # make a request to the wiki for locations
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
                    "itemID": k,
                    "locations": locations,
                    "minVersion": minVersion,
                    "trapFish": True,
                }
                continue
            
            #get the locations from Locations.json to get the Seasons
            fish_locations = {}
            for location, location_details in LOCATIONS.items():
                if location == "Temp":
                    continue
        
                for fish in location_details["Fish"]:
                    if fish["Id"] == "(O)" + k or fish["ItemId"] == "(O)" + k:
                        fish_details = {
                            "Condition": fish.get("Condition", None),
                            "Season": fish.get("Season", None),
                            "MinLevel": fish.get("MinFishingLevel", None),
                        }
                        fish_locations[location] = fish_details
                        break # only one fish per location
            
            fish_info = get_fish_info(fish_locations)
            
            # hardcoded checks for legendary fish
            # there's some differences between Fish.json and the real behavior of the fish
            if k in LEGENDARY_FISH:
                start_time = "6AM"
                end_time = "2AM"
                locations = LEGENDARY_FISH[k]["locations"]
            else:
                start_time = convert_time(fish_fields[5].split(" ")[0])
                end_time = convert_time(fish_fields[5].split(" ")[1])
                
            min_level = fish_info["min_level"]
            seasons = fish_info["seasons"]
            difficulty = f"{fish_fields[1]} {fish_fields[2]}"
            time = f"{start_time} - {end_time}"
            weather = fish_fields[7]

            output[k] = {
                "difficulty": difficulty,
                "itemID": k,
                "locations": locations,
                "minLevel": min_level,
                "minVersion": minVersion,
                "seasons": [s.capitalize() for s in seasons],
                "time": time,
                "trapFish": False,
                "weather": weather.capitalize(),
            }

    return output


if __name__ == "__main__":
    fish = get_fish()

    # as of 1.5, there were 67 fish that count for fishing achievements
    # (O)372 (Clam) previously didn't count, but it does now since it's a Fish Type
    # 1.6.0 added 4 new fish that count for fishing achievements
    # so all together there should be 67 + 1 + 4 = 72 fish
    # the clam won't be shown on the game's fishing collection page though
    assert len(fish) == 67 + 1 + 4
    assert len([f for f in fish.values() if f.get("trapFish")]) == 10  # trap fish
    assert len([f for f in fish.values() if not f.get("trapFish")]) == 62
    save_json(fish, "fish.json", sort=True)

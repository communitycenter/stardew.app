# Parsing all Achievement data from game files
# Heavily simplified from last time bc we didn't use all that data

# ! Run file from processors directory

# TODO: parse the wiki for achievements
"""
    We might have to parse the wiki for achievements because the game files
    don't have some of the exclusive achievements from steam/ps/xbox. Last time
    we hardcoded all of that information, but it would be better to automate it
"""

import json
import bs4
import requests

Achievements = {}

with open("../raw_data/Achievements.json") as f:
    data = json.load(f)

for key, value in data.items():
    fields = value.split("^")
    
    # For now we don't care about whether the achievement is secret or not
    name = fields[0]
    description = fields[1]

    # Just get the title for money achievements
    if int(key) in range(5):
        name = name.split(" ")[0]

    wiki_url = "https://stardewvalleywiki.com/File:Achievement_" + name.replace(" ", "_").replace("'", "") + ".jpg"
    # weird cases where name is different from wiki url
    if key == "20":
        wiki_url = "https://stardewvalleywiki.com/File:Achievement_DIY.jpg"
    elif key == "22":
        wiki_url = "https://stardewvalleywiki.com/File:Achievement_Master_Craft.jpg"
    
    r = requests.get(wiki_url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    Achievements[name] = {
        "id": int(key),
        "name": name,
        "description": description,
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
    } 

with open("./data/achievements.json", "w") as f:
    json.dump(Achievements, f, indent=4)
# Parsing all Achievement data from game files
# https://stardewvalleywiki.com/Modding:Achievement_data

# looks like some of the achievements are missing from the game data like the
# ones with no hat reward (i.e, Mystery Of The Stardrops) so i'll have to 
# hardcode those 🙂

import json
import bs4
import requests

Achievements = {}

with open("../raw_data/Achievements.json", "r") as file:
    rawData = json.load(file)

for key, value in rawData["content"].items():
    fields = value.split("^")
    
    name = fields[0]
    description = fields[1]
    # in the game files the boolean represent whether to show the item or not
    # so fields that are `true` are not secret
    isSecret = False if fields[2] == "true" else True 
    rewardID = int(fields[4])
    
    if int(key) in range(5): # money achievements
        name = name.split(" ")[0] # only want the first word

    wiki_url = "https://stardewvalleywiki.com/File:Achievement_" + name.replace(" ", "_").replace("'", "") + ".jpg"
    if key == "20": # why does the wiki not treat everything the same
        wiki_url = "https://stardewvalleywiki.com/File:Achievement_DIY.jpg"
    elif key == "22":
        wiki_url = "https://stardewvalleywiki.com/File:Achievement_Master_Craft.jpg"
    r = requests.get(wiki_url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]
    
    Achievements[name] = {
        "id": int(key),
        "name": name,
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
        "description": description,
        "isSecret": isSecret,
        "rewardID": rewardID
    }
    
with open("./data/achievements.json", "w") as file:
    json.dump(Achievements, file, indent=4)
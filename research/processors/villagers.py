# Processing all the relevant villager information from the in game data
# Format information from https://stardewvalleywiki.com/Modding:NPC_data
#                         https://stardewvalleywiki.com/Modding:Gift_taste_data

import json, bs4, requests
from typing import List

villagers = {}

with open("../raw_data/NPCDispositions.json", "r") as file:
    npc_info = json.load(file)
    npc_info = npc_info["content"]

with open("../raw_data/NPCGiftTastes.json", "r") as file:
    gift_tastes = json.load(file)
    gift_tastes = gift_tastes["content"]

with open("./data/objects.json", "r") as file:
    objects = json.load(file)

key: str
value: str
for key, value in npc_info.items():

    fields = value.split("/")
    dateable = True if fields[5] == "datable" else False
    try:
        bday = fields[8][0].upper() + fields[8][1:]
    except:
        print(fields[8])
        print(key)
    try:
        tastes: List[str] = gift_tastes[key].split("/")
    except:
        continue

    # create a list of all ids, but only add itemIDs that are in objects.json
    # or negative numbers which are categories
    loves = [
        int(x)
        for x in tastes[1].split(" ")
        if x != "" and ((x in objects) if int(x) > 0 else True)
    ]
    likes = [
        int(x)
        for x in tastes[3].split(" ")
        if x != "" and ((x in objects) if int(x) > 0 else True)
    ]
    dislikes = [
        int(x)
        for x in tastes[5].split(" ")
        if x != "" and ((x in objects) if int(x) > 0 else True)
    ]
    hates = [
        int(x)
        for x in tastes[7].split(" ")
        if x != "" and ((x in objects) if int(x) > 0 else True)
    ]

    wiki_url = f"https://stardewvalleywiki.com/File:{key}.png"
    r = requests.get(wiki_url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    villagers[key] = {
        "name": key,
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
        "isDateable": dateable,
        "birthday": bday,
        "loves": loves,
        "likes": likes,
        "dislikes": dislikes,
        "hates": hates,
    }

with open("./data/villagers.json", "w") as file:
    json.dump(villagers, file, indent=4)

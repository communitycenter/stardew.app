# Processing all relevant data for villagers
# References:
#   - https://stardewvalleywiki.com/Modding:NPC_data
#   - https://stardewvalleywiki.com/Modding:Gift_taste_data
import json
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

with open("../raw_data/NPCDispositions.json", "r") as f:
    npc_info = json.load(f)

with open("../raw_data/NPCGiftTastes.json", "r") as f:
    npc_gifts = json.load(f)

with open("../raw_data/ObjectInformation.json", "r") as f:
    objects = json.load(f)

# universals
u_love = set([item for item in npc_gifts["Universal_Love"].split(" ")])
u_like = set([item for item in npc_gifts["Universal_Like"].split(" ")])
u_neutral = set([item for item in npc_gifts["Universal_Neutral"].split(" ")])
u_dislike = set([item for item in npc_gifts["Universal_Dislike"].split(" ")])
u_hate = set([item for item in npc_gifts["Universal_Hate"].split(" ")])


def getCategoryNumber(itemID) -> int | None:
    if str(itemID) not in objects:
        return None

    try:
        _type, categoryNumber = objects[str(itemID)].split("/")[3].split(" ")
    except ValueError:
        _type = objects[str(itemID)].split("/")[3]
        categoryNumber = None

    return int(categoryNumber) if categoryNumber is not None else None


def getGiftTaste(itemID, npc_name):
    # StardewValley.NPC.cs::getGiftTasteForThisItem()
    # 0 = love, like = 2, dislike = 4, hate = 6,  neutral = 8
    taste = 8  # neutral?
    if itemID in objects:
        edibility = int(objects[itemID].split("/")[2])
        price = int(objects[itemID].split("/")[1])
        try:
            _type, categoryNumber = objects[itemID].split("/")[3].split(" ")
        except ValueError:
            _type = objects[itemID].split("/")[3]
            categoryNumber = None

        if categoryNumber in u_love:
            taste = 0
        elif categoryNumber in u_hate:
            taste = 6
        elif categoryNumber in u_like:
            taste = 2
        elif categoryNumber in u_dislike:
            taste = 4

        wasIndividualUniversal = False
        skipDefaultValueRules = False
        if itemID in u_love:
            taste = 0
            wasIndividualUniversal = True
        elif itemID in u_hate:
            taste = 6
            wasIndividualUniversal = True
        elif itemID in u_like:
            taste = 2
            wasIndividualUniversal = True
        elif itemID in u_dislike:
            taste = 4
            wasIndividualUniversal = True
        elif itemID in u_neutral:
            taste = 8
            wasIndividualUniversal = True
            skipDefaultValueRules = True

        if "Arch" in _type:
            taste = 4
            if npc_name == "Penny" or npc_name == "Dwarf":
                taste = 2
        if taste == 8 and not skipDefaultValueRules:
            if edibility != -300 and edibility < 0:
                taste = 6
            elif price < 20:
                taste = 4

        npc_likes = npc_gifts[npc_name].split("/")
        # index 0 = love, 1 = like, 2 = dislike, 3 = hate, 4 = neutral
        items = []
        for i in range(0, 10, 2):
            splitItems = npc_likes[i + 1].split(" ")
            thisItems = [item for item in splitItems if len(item) > 0]
            items.append(thisItems)

        if itemID in items[0]:
            return 0
        if itemID in items[3]:
            return 6
        if itemID in items[1]:
            return 2
        if itemID in items[2]:
            return 4

        if not wasIndividualUniversal:
            if categoryNumber != "0" and categoryNumber in items[0]:
                return 0
            if categoryNumber != "0" and categoryNumber in items[3]:
                return 6
            if categoryNumber != "0" and categoryNumber in items[1]:
                return 2
            if categoryNumber != "0" and categoryNumber in items[2]:
                return 4
            if categoryNumber != "0" and categoryNumber in items[4]:
                return 8
    return taste


villagers = {}
for key, value in tqdm(npc_info.items()):
    # Some villagers you can't build a relationship with (e.g. Marlon)
    if key not in npc_gifts:
        continue

    fields = value.split("/")
    datable = True if fields[5] == "datable" else False

    name = key
    birthday = fields[8][0].upper() + fields[8][1:]
    tastes = npc_gifts[key].split("/")

    # build out loves, likes, dislikes, and hates
    # start with categories
    loves = set([int(itemID) for itemID in u_love if int(itemID) < 0])  # taste = 0
    likes = set([int(itemID) for itemID in u_like if int(itemID) < 0])  # taste = 2
    dislikes = set(
        [int(itemID) for itemID in u_dislike if int(itemID) < 0]
    )  # taste = 4
    hates = set([int(itemID) for itemID in u_hate if int(itemID) < 0])  # taste = 6

    items = []
    for i in range(0, 10, 2):
        splitItems = tastes[i + 1].split(" ")
        thisItems = [item for item in splitItems if len(item) > 0]
        items.append(thisItems)

    # loves (check to make sure there's no override)
    for itemID in items[0]:
        if int(itemID) < 0:
            # check if this is an override from prev categories
            if itemID in likes:
                likes.remove(int(itemID))
            if itemID in dislikes:
                dislikes.remove(int(itemID))
            if itemID in hates:
                hates.remove(int(itemID))
            loves.add(int(itemID))
        else:
            categoryNumber = getCategoryNumber(itemID)
            # check to see if there's an override and if the category is in already
            if getGiftTaste(itemID, name) != 0 or categoryNumber in loves:
                continue
            loves.add(int(itemID))

    # likes (check to make sure there's no override)
    for itemID in items[1]:
        if int(itemID) < 0:
            if itemID in loves:
                loves.remove(int(itemID))
            if itemID in dislikes:
                dislikes.remove(int(itemID))
            if itemID in hates:
                hates.remove(int(itemID))
            likes.add(int(itemID))
        else:
            categoryNumber = getCategoryNumber(itemID)
            if getGiftTaste(itemID, name) != 2 or categoryNumber in likes:
                continue
            likes.add(int(itemID))

    # dislikes (check to make sure there's no override)
    for itemID in items[2]:
        if int(itemID) < 0:
            if itemID in loves:
                loves.remove(int(itemID))
            if itemID in likes:
                likes.remove(int(itemID))
            if itemID in hates:
                hates.remove(int(itemID))
            dislikes.add(int(itemID))
        else:
            categoryNumber = getCategoryNumber(itemID)
            if getGiftTaste(itemID, name) != 4 or categoryNumber in dislikes:
                continue
            dislikes.add(int(itemID))

    # hates (check to make sure there's no override)
    for itemID in items[3]:
        if int(itemID) < 0:
            if itemID in loves:
                loves.remove(int(itemID))
            if itemID in likes:
                likes.remove(int(itemID))
            if itemID in dislikes:
                dislikes.remove(int(itemID))
            hates.add(int(itemID))
        else:
            categoryNumber = getCategoryNumber(itemID)
            if getGiftTaste(itemID, name) != 6 or categoryNumber in hates:
                continue
            hates.add(int(itemID))

    # now go through all the positive IDs from universals and add them to the appropriate category
    for itemID in u_love:
        if int(itemID) < 0:
            continue
        categoryNumber = getCategoryNumber(itemID)
        if categoryNumber in loves:
            continue
        if getGiftTaste(itemID, name) == 0:
            loves.add(int(itemID))

    for itemID in u_like:
        if int(itemID) < 0:
            continue
        categoryNumber = getCategoryNumber(itemID)
        if categoryNumber in likes:
            continue
        if getGiftTaste(itemID, name) == 2:
            likes.add(int(itemID))

    # scrape for villager icon
    wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
    page = requests.get(wiki_url)
    soup = BeautifulSoup(page.text, "html.parser")
    iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]

    villagers[name] = {
        "name": name,
        "iconURL": f"https://stardewvalleywiki.com{iconURL}",
        "birthday": birthday,
        "datable": datable,
        "loves": list(loves),
        "likes": list(likes),
    }

with open("../../data/villagers.json", "w") as f:
    json.dump(villagers, f, separators=(",", ":"), sort_keys=True)

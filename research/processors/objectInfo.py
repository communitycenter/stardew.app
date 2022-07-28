import json
import bs4
import requests

ObjectInformation = {}
DEBUG = False

cmap = { # categories map from https://stardewvalleywiki.com/Modding:Items#Categories
    "-2": "Mineral",
    "-4": "Fish",
    "-5": "Animal Product",
    "-6": "Animal Product",
    "-7": "Cooking",
    "-8": "Crafting",
    "-12": "Mineral",
    "-15": "Resource",
    "-16": "Resource",
    "-17": "Basic", # I have absolutely no clue what this category actually means. Shoutout ConcernedApe.
    "-18": "Animal Product",
    "-19": "Fertilizer",
    "-20": "Trash",
    "-21": "Bait",
    "-22": "Fishing Tackle",
    "-23": "Basic",
    "-24": "Decor",
    "-25": "Cooking",
    "-26": "Artisan Goods",
    "-27": "Artisan Goods",
    "-28": "Monster Loot",
    "-74": "Seed",
    "-75": "Vegetable",
    "-79": "Fruit",
    "-80": "Flower",
    "-81": "Forage",
    "Basic": "Basic",
    "Quest": "Quest",
    "Arch": "Arch",
    "asdf": "asdf",
    "Crafting": "Crafting",
    "Fish": "Fish",
    "Ring": "Ring"
}

weird_files = { # hardcoding these bc idk how else to find their links
    "126": "https://stardewcommunitywiki.com/File:Strange_Doll_(green).png",
    "127": "https://stardewcommunitywiki.com/File:Strange_Doll_(yellow).png",
    "168": "https://stardewcommunitywiki.com/File:Trash_(item).png",
    "261": "https://stardewcommunitywiki.com/File:Warp_Totem_Desert.png",
    "438": "https://stardewcommunitywiki.com/File:Large_Goat_Milk.png",
    "688": "https://stardewcommunitywiki.com/File:Warp_Totem_Farm.png",
    "689": "https://stardewcommunitywiki.com/File:Warp_Totem_Mountains.png",
    "690": "https://stardewcommunitywiki.com/File:Warp_Totem_Beach.png",
    "886": "https://stardewcommunitywiki.com/File:Warp_Totem_Island.png",
    "892": "https://stardewcommunitywiki.com/File:Warp_Totem_Qi%27s_Arena.png",
    "922": "https://stardewcommunitywiki.com/File:Supply_Crate_1.png",
    "923": "https://stardewcommunitywiki.com/File:Supply_Crate_2.png",
    "924": "https://stardewcommunitywiki.com/File:Supply_Crate_3.png"
}

skip = set(["925", "927", "929", "930"]) # have descriptions but no use or image

with open("../raw_data/ObjectInformation.json", "r") as file:
    rawInfo = json.load(file) 

for key, value in rawInfo["content"].items():
    if key in skip:
        continue
    
    fields = value.split("/")

    name = fields[0]
    description = fields[5]
    category = cmap[fields[3].split(" ")[-1]] # some categories are just "Basic" and others have two fields so we'll just base if off the end
    
    # attempt to find the icon URL, some of these have different file names like Springobjects000.png
    wiki_url = f"https://stardewvalleywiki.com/File:{name}.png"
    
    if key in weird_files: 
        wiki_url = weird_files[key]
    
    r = requests.get(wiki_url)
    if (r.status_code == 301) or (r.status_code == 404):
        # This means that the item name doesn't have a file for its image
        # so it can be found under SpringobjectsXXX and we zeropad the itemID
        wiki_url = f"https://stardewvalleywiki.com/File:Springobjects{key.zfill(3)}.png"
        r = requests.get(wiki_url)
    soup = bs4.BeautifulSoup(r.text, "html.parser")
    try:
        iconURL = soup.find("div", {"class": "fullImageLink"}).find("img")["src"]
    except AttributeError:
        print("Error with: ")
        print(key, name, description)
        DEBUG = True
        
    
    ObjectInformation[name] = {
        "itemID": int(key),
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
        "description": description,
        "category": category
    }

if not DEBUG: # no issues finding the files so we'll write it to a file
    with open("./data/objects.json", "w") as file:
        json.dump(ObjectInformation, file, indent=4)
else:
    print("exited without writing to file due to error.")
# Taking all information from ObjectInformation.xnb and making it human readable
# + adding the iconURLs

# Formatting information from https://stardewcommunitywiki.com/Modding:Object_data
# and https://stardewvalleywiki.com/Modding:Items

import json
import bs4
import requests

ObjectInformation = {}
DEBUG = False

cmap = { # categories map from https://stardewvalleywiki.com/Modding:Items#Categories
    "-2": "Minerals, Gems",
    "-4": "Fish",
    "-5": "Animal Products, Eggs",
    "-6": "Animal Product, Milks",
    "-7": "Cooking",
    "-8": "Crafting",
    "-12": "Minerals",
    "-15": "Resources, Metal Resources",
    "-16": "Resources, Building Resources",
    "-17": "Basic", # I have absolutely no clue what this category actually means. Shoutout ConcernedApe.
    "-18": "Animal Products",
    "-19": "Fertilizers",
    "-20": "Trash",
    "-21": "Bait",
    "-22": "Fishing Tackles",
    "-23": "Basic",
    "-24": "Furniture",
    "-25": "Cooking",
    "-26": "Artisan Goods",
    "-27": "Artisan Goods, Syrups",
    "-28": "Monster Loot",
    "-74": "Seeds",
    "-75": "Vegetables",
    "-79": "Fruits",
    "-80": "Flowers",
    "-81": "Forage",
    "Basic": "Basic",
    "Quest": "Quest",
    "Arch": "Arch",
    "asdf": "asdf",
    "Crafting": "Crafting",
    "Fish": "Fish",
    "Ring": "Ring"
}

skip = set(["925", "927", "929", "930"]) # have descriptions but no use or image

with open("../raw_data/ObjectInformation.json", "r") as file:
    rawInfo = json.load(file) 

# { itemID: iconURL }    
with open("./data/sprites.json", "r") as file:
    sprites = json.load(file)

for key, value in rawInfo["content"].items():
    if key in skip:
        continue
    
    fields = value.split("/")

    name = fields[0]
    description = fields[5]
    category = cmap[fields[3].split(" ")[-1]] # some categories are just "Basic" and others have two fields so we'll just base if off the end
    
    # now that we scraped the Object Sprites we can just perform a lookup 
    # instead of making a request and scraping the page for the image
    iconURL = sprites[key]
    
    ObjectInformation[key] = {
        "name": name,
        "iconURL": iconURL,
        "description": description,
        "category": category
    }

if not DEBUG: # no issues finding the files so we'll write it to a file
    with open("./data/objects.json", "w") as file:
        json.dump(ObjectInformation, file, indent=4)
else:
    print("exited without writing to file due to error.")
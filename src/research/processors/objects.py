# This will be the file that we pull names, descriptions, and icons from.
# ! Run file from processors directory

# Formatting information from https://stardewcommunitywiki.com/Modding:Object_data
# and https://stardewvalleywiki.com/Modding:Items

import json

from tqdm import tqdm


objects = {}
cmap = {  # categories map from https://stardewvalleywiki.com/Modding:Items#Categories
    "-2": "Minerals",
    "-4": "Fish",
    "-5": "Animal Products, Eggs",
    "-6": "Animal Product, Milks",
    "-7": "Cooking",
    "-8": "Crafting",
    "-12": "Minerals",
    "-15": "Resources, Metal Resources",
    "-16": "Resources, Building Resources",
    "-17": "Basic",  # I have absolutely no clue what this category actually means. Shoutout ConcernedApe.
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
    "Ring": "Ring",
}

# Room for improvement since we don't use a vast majority of things in the game
skip = set(["925", "927", "929", "930"])  # have descriptions but no use or image

with open("../raw_data/ObjectInformation.json") as f:
    object_info = json.load(f)

# { itemID: iconURL }
with open("./sprites.json") as f:
    sprites = json.load(f)

for key, value in tqdm(object_info.items()):
    if key in skip:
        continue

    fields = value.split("/")
    name = fields[0]
    description = fields[5]
    category = cmap[
        fields[3].split(" ")[-1]
    ]  # some categories are just "Basic" and others have two fields so we'll just base if off the end

    iconURL = sprites[key]

    objects[key] = {
        "name": name,
        "description": description,
        "category": category,
        "iconURL": iconURL,
    }

with open("../../data/objects.json", "w") as f:
    json.dump(objects, f, separators=(",", ":"), sort_keys=True)

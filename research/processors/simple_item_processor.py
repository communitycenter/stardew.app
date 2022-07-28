import json

# 0: name
# 1: price
# 2: edibility
# 3: type/category

# ConcernedApe is my #1 enemy.

with open("../raw_data/ObjectInformation.json", "r") as f:
    objects = json.load(f)

with open("../raw_data/BigCraftablesInformation.json", "r") as f:
    bigObjects = json.load(f)

with open("../raw_data/Furniture.json", "r") as f:
    furniture = json.load(f)

with open("../raw_data/hats.json", "r") as f:
    hats = json.load(f)

with open("../raw_data/ClothingInformation.json", "r") as f:
    clothing = json.load(f)

items = {}
items["O"] = {}
items["BO"] = {}
items["F"] = {}
items["H"] = {}
items["C"] = {}
items["R"] = {}

for key, value in objects["content"].items():
    items["O"][key] = value.split("/")[0]

for key, value in bigObjects["content"].items():
    items["BO"][key] = value.split("/")[0]

for key, value in furniture["content"].items():
    items["F"][key] = value.split("/")[0]

for key, value in hats["content"].items():
    items["H"][key] = value.split("/")[0]

for key, value in clothing["content"].items():
    items["C"][key] = value.split("/")[0]

with open("./data/items.json", "w") as f:
    json.dump(items, f, indent=4)

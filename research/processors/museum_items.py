import json


with open("./data/objects.json") as file:
    objects = json.load(file)

artifacts = {}
minerals = {}

for key, val in objects.items():
    if val["category"] == "Arch":
        artifacts[key] = val
        artifacts[key]["itemID"] = int(key)
    elif val["category"] == "Minerals":
        minerals[key] = val
        minerals[key]["itemID"] = int(key)

museum = {}
museum["artifacts"] = artifacts
museum["minerals"] = minerals

with open("./data/museum.json", "w") as file:
    json.dump(museum, file, indent=4)

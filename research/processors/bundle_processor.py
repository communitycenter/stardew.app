import json, re
from operator import indexOf

with open("../data/Bundles.json", "r") as f:
    ObjInfo = json.load(f)

with open("./items.json", "r") as f:
    itemMapping = json.load(f)


def spaceSplitter(s, spl, ind):
    indx = [i for i, j in enumerate(s) if j == spl][ind - 1]
    return [s[:indx], s[indx + 1 :]]


def processTypeOfObject(bundleRewardType, bundleRewardItemID):
    if bundleRewardType == "R":
        return itemMapping["O"][bundleRewardItemID]
    else:
        return itemMapping[bundleRewardType][bundleRewardItemID]


bundles = {}
for key, value in ObjInfo["content"].items():
    bundleLocation = key.split("/")[0]
    bundles[bundleLocation] = {}

for key, value in ObjInfo["content"].items():
    bundleLocation = key.split("/")[0]
    spriteIndex = key.split("/")[1]

    bundleName = value.split("/")[0]
    bundleRewardType = value.split("/")[1].split(" ")[0]
    bundleRewardItemID = value.split("/")[1].split(" ")[1]
    bundleRewardItemQuantity = value.split("/")[1].split(" ")[2]

    bundles[bundleLocation][bundleName] = {}

    bundles[bundleLocation][bundleName]["reward"] = {}
    bundles[bundleLocation][bundleName]["reward"]["itemType"] = bundleRewardType

    bundles[bundleLocation][bundleName]["reward"]["itemName"] = processTypeOfObject(
        bundleRewardType, bundleRewardItemID
    )
    bundles[bundleLocation][bundleName]["reward"]["itemID"] = bundleRewardItemID
    bundles[bundleLocation][bundleName]["reward"][
        "itemQuantity"
    ] = bundleRewardItemQuantity

    bundles[bundleLocation][bundleName]["itemsRequired"] = {}
    bundleRequiredItemArray = [
        x for x in re.split(r"(.*?\s.*?\s.*?)\s", value.split("/")[2]) if x
    ]
    try:
        bundleRequiredItemCount = value.split("/")[4]
    except:
        bundleRequiredItemCount = len(bundleRequiredItemArray)
    bundles[bundleLocation][bundleName]["itemsRequired"][
        "count"
    ] = bundleRequiredItemCount

    for item in bundleRequiredItemArray:
        itemID = item.split(" ")[0]
        itemQuantity = item.split(" ")[1]
        itemQuality = item.split(" ")[2]

        bundles[bundleLocation][bundleName]["itemsRequired"][
            bundleRequiredItemArray.index(item)
        ] = {}
        bundles[bundleLocation][bundleName]["itemsRequired"][
            bundleRequiredItemArray.index(item)
        ]["itemID"] = itemID
        bundles[bundleLocation][bundleName]["itemsRequired"][
            bundleRequiredItemArray.index(item)
        ]["itemQuantity"] = itemQuantity
        bundles[bundleLocation][bundleName]["itemsRequired"][
            bundleRequiredItemArray.index(item)
        ]["itemQuality"] = itemQuality
        try:
            bundles[bundleLocation][bundleName]["itemsRequired"][
                bundleRequiredItemArray.index(item)
            ]["itemName"] = itemMapping["O"][itemID]
        except:
            pass


with open("bundles.json", "w") as f:
    json.dump(bundles, f, indent=4)

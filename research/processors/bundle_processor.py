import json, re

with open("../raw_data/Bundles.json", "r") as f:
    ObjInfo = json.load(f)

with open("./data/items.json", "r") as f:
    itemMapping = json.load(f)


def spaceSplitter(s, spl, ind):
    indx = [i for i, j in enumerate(s) if j == spl][ind - 1]
    return [s[:indx], s[indx + 1 :]]


def processTypeOfObject(bundleRewardType, bundleRewardItemID):
    if bundleRewardType == "R":
        return itemMapping["O"][bundleRewardItemID]
    else:
        return itemMapping[bundleRewardType][bundleRewardItemID]


def processQualityOfItem(itemQuality):
    if itemQuality == "0":
        return "Common"
    elif itemQuality == "1":
        return "Silver"
    elif itemQuality == "2":
        return "Gold"
    elif itemQuality == "3":
        return "Iridium"


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

    bundles[bundleLocation][bundleName]["items"] = {}
    bundleRequiredItemArray = [
        x for x in re.split(r"(.*?\s.*?\s.*?)\s", value.split("/")[2]) if x
    ]
    try:
        bundleRequiredItemCount = value.split("/")[4]
    except:
        bundleRequiredItemCount = len(bundleRequiredItemArray)
    bundles[bundleLocation][bundleName]["itemsRequired"] = int(bundleRequiredItemCount)

    bundles[bundleLocation][bundleName]["items"] = []

    for item in bundleRequiredItemArray:
        itemID = item.split(" ")[0]
        itemQuantity = item.split(" ")[1]
        itemQuality = item.split(" ")[2]

        try:
            itemName = itemMapping["O"][itemID]

            item = {}

            item["itemID"] = int(itemID)
            item["itemName"] = itemMapping["O"][itemID]
            item["itemQuantity"] = int(itemQuantity)
            item["itemQuality"] = processQualityOfItem(itemQuality)

            bundles[bundleLocation][bundleName]["items"].append(item)
        except:
            pass

    bundles[bundleLocation][bundleName]["bundleReward"] = {}
    bundles[bundleLocation][bundleName]["bundleReward"]["itemType"] = bundleRewardType

    bundles[bundleLocation][bundleName]["bundleReward"][
        "itemName"
    ] = processTypeOfObject(bundleRewardType, bundleRewardItemID)
    bundles[bundleLocation][bundleName]["bundleReward"]["itemID"] = int(
        bundleRewardItemID
    )
    bundles[bundleLocation][bundleName]["bundleReward"]["itemQuantity"] = int(
        bundleRewardItemQuantity
    )


with open("bundles.json", "w") as f:
    json.dump(bundles, f, indent=4)

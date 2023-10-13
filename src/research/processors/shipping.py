# Find all items that count for Full Shipment
# References:
# - StardewValley.Object.cs::isIndexOkForBasicShippedCategory()
# - StardewValley.Object.cs::isPotentialBasicShippedCategory()
# - StardewValley.Utility.cs::hasFarmerShippedAllItem()
#
# ShippingMenu.cs contains the logic for adding the Full Shipment Achievement.
# it calls StardewValley.Utility.cs::hasFarmerShippedAllItems()
# hasFarmerShippedAllItems() then calls getFarmerItemsShippedPercent() which
# returns the percentage of items that the player has shipped that count for
# the Full Shipment Achievement.
#
# We're going to try and mimic that logic to get a list of all items that count
# ---------------------------------------------------------------------------- #
# For Crop Shipping Achievements:
# - StardewValley.Stats.cs::checkForShippingAchievements()
#
# We'll create an object of all items that count for the Full Shipment Achievement
# and the values will be booleans indicating if the item counts for monoculture
# and/or polyculture achievements.
#
# Since SDV devs hardcode the values for monoculture and polyculture,
# we'll just copy the raw code into a string and regex it.

import re
import json

# we're not going to use the parsed version because we need the category values
with open("../raw_data/ObjectInformation.json", "r") as f:
    object_data = json.load(f)

with open("../raw_data/Crops.json", "r") as f:
    crops = json.load(f)


def isIndexOkForBasicShippedCategory(index):
    # Objects.cs::isIndexOkForBasicShippedCategory()
    match index:
        case 434:
            return False
        case 889 | 928:
            return False
        case _:
            return True


def isPotentialBasicShippedCategory(index, category):
    # Objects.cs::isPotentialBasicShippedCategory()
    index = int(index)
    cat = 0
    try:
        cat = int(category)
    except:
        cat = 0

    if index == 433:
        return True

    match cat:
        case -74 | -29 | -24 | -22 | -21 | -20 | -19 | -14 | -12 | -8 | -7 | -2:
            return False
        case 0:
            return False
        case _:
            return isIndexOkForBasicShippedCategory(index)


# get the crops and their seasons
crop_seasons = {}

# split this into processable data
for k, v in crops.items():
    fields = v.split("/")

    itemID = fields[3]
    seasons = fields[1].split(" ")
    crop_seasons[itemID] = seasons

# find all items that count for polyculture (achievement 31)
condition = "if (this.farmerShipped(24, 15) && this.farmerShipped(188, 15) && this.farmerShipped(190, 15) && this.farmerShipped(192, 15) && this.farmerShipped(248, 15) && this.farmerShipped(250, 15) && this.farmerShipped(252, 15) && this.farmerShipped(254, 15) && this.farmerShipped(256, 15) && this.farmerShipped(258, 15) && this.farmerShipped(260, 15) && this.farmerShipped(262, 15) && this.farmerShipped(264, 15) && this.farmerShipped(266, 15) && this.farmerShipped(268, 15) && this.farmerShipped(270, 15) && this.farmerShipped(272, 15) && this.farmerShipped(274, 15) && this.farmerShipped(276, 15) && this.farmerShipped(278, 15) && this.farmerShipped(280, 15) && this.farmerShipped(282, 15) && this.farmerShipped(284, 15) && this.farmerShipped(300, 15) && this.farmerShipped(304, 15) && this.farmerShipped(398, 15) && this.farmerShipped(400, 15) && this.farmerShipped(433, 15))"
pattern = r"this\.farmerShipped\((\d+), 15\)"
poly_ids = set([int(match.group(1)) for match in re.finditer(pattern, condition)])

# find all items that count for monoculture (achievement 32)
condition = "if (this.farmerShipped(24, 300) || this.farmerShipped(188, 300) || this.farmerShipped(190, 300) || this.farmerShipped(192, 300) || this.farmerShipped(248, 300) || this.farmerShipped(250, 300) || this.farmerShipped(252, 300) || this.farmerShipped(254, 300) || this.farmerShipped(256, 300) || this.farmerShipped(258, 300) || this.farmerShipped(260, 300) || this.farmerShipped(262, 300) || this.farmerShipped(264, 300) || this.farmerShipped(266, 300) || this.farmerShipped(268, 300) || this.farmerShipped(270, 300) || this.farmerShipped(272, 300) || this.farmerShipped(274, 300) || this.farmerShipped(276, 300) || this.farmerShipped(278, 300) || this.farmerShipped(280, 300) || this.farmerShipped(282, 300) || this.farmerShipped(284, 300) || this.farmerShipped(454, 300) || this.farmerShipped(300, 300) || this.farmerShipped(304, 300) || (this.farmerShipped(398, 300) | this.farmerShipped(433, 300)) || this.farmerShipped(400, 300) || this.farmerShipped(591, 300) || this.farmerShipped(593, 300) || this.farmerShipped(595, 300) || this.farmerShipped(597, 300))"
pattern = r"this\.farmerShipped\((\d+), 300\)"
mono_ids = set([int(match.group(1)) for match in re.finditer(pattern, condition)])

shipping = {}
for key, value in object_data.items():
    typeString: str = value.split("/")[3]

    name = object_data[str(key)].split("/")[0]
    # directly from getFarmerItemsShippedPercent()
    if (
        (not "Arch" in typeString)
        and (not "Fish" in typeString)
        and (not "Mineral" in typeString)
        and (not typeString[-3:] == "-2")
        and (not "Cooking" in typeString)
        and (not typeString[-3:] == "-7")
        and (isPotentialBasicShippedCategory(key, typeString[-3:]))
    ):
        shipping[key] = {
            "itemID": int(key),
            "polyculture": int(key) in poly_ids,
            "monoculture": int(key) in mono_ids,
            "seasons": crop_seasons.get(
                key, []
            ),  # empty list if not a crop, otherwise list of seasons
        }

with open("../../data/shipping.json", "w") as f:
    json.dump(shipping, f, separators=(",", ":"))

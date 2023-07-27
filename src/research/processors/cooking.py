import json

from tqdm import tqdm

# hardcoding these recipeSources that would need to be scraped.
# if you want to avoid hardcoding you can look at the method from crafting_recipes.py
recipeSource = {
    "Cookie": "Evelyn (4-heart event).",
    "Triple Shot Espresso": "Stardrop Saloon for 5,000g.",
    "Ginger Ale": "Dwarf Shop in Volcano Dungeon for 1,000g.",
    "Banana Pudding": "Island Trader for 30 Bone Fragments.",
    "Tropical Curry": "Ginger Island Resort for 2,000g.",
}


def get_tv_airing_date(key: int) -> str:
    """
    Returns the string for when the recipe with the given key will air on TV.

    Args:
      key(int): The key of the recipe in the JSON file.

    Returns:
      str: A string in the format "Spring 7, Year 1".
    """

    # 28 days in a season, 4 seasons per year
    seasons = ["Spring", "Summer", "Fall", "Winter"]
    day = (key * 7) % 28
    if day == 0:
        day = 28

    season_idx = (key - 1) // 4
    season = seasons[season_idx % 4]

    year = (key * 7) // 112 + 1

    return f"{season} {day}, Year {year}"


# { name : tv_airing_date }
tv_recipes = {}
with open("../raw_data/CookingChannel.json", "r") as f:
    channel_recipes = json.load(f)

for key, value in channel_recipes.items():
    name = value.split("/")[0]
    tv_recipes[name] = get_tv_airing_date(int(key))

with open("../../data/objects.json", "r") as f:
    objects = json.load(f)

cooking_recipes = {}
with open("../raw_data/CookingRecipes.json", "r") as f:
    data = json.load(f)

unknowns = []
for key, value in tqdm(data.items()):
    fields = value.split("/")

    # before we had to manually translate the names
    # now we just lookup up the name from the yield ID
    name = objects[fields[2]]["name"]

    ingredients = []
    # create pairs of (itemID, quantity)
    ingr = fields[0]
    i = iter(ingr.split(" "))
    pairs = map(" ".join, zip(i, i))
    for pair in pairs:
        itemID, quantity = pair.split(" ")
        ingredients.append({"itemID": int(itemID), "quantity": int(quantity)})

    itemID = int(fields[2])  # yield

    unlock_conditions = fields[3].split(" ")
    if unlock_conditions[0] == "default":
        unlock_conditions = "Starter Recipe - no steps required!"
    elif unlock_conditions[0] == "f":  # unlocked through friendship
        npc = unlock_conditions[1]
        hearts = unlock_conditions[2]
        unlock_conditions = f"Reach {hearts} hearts with {npc}."
    elif unlock_conditions[0] == "l":  # player level
        unlock_conditions = f"Reach farmer level {unlock_conditions[1]}."
    elif unlock_conditions[0] == "s":  # skill level
        skill = unlock_conditions[1]
        level = unlock_conditions[2]
        unlock_conditions = f"Reach level {level} in {skill} skill."
    else:
        unknowns.append(f"{name}: Unknown unlock condition: {unlock_conditions}")
        unlock_conditions = "Unknown"

    if name in recipeSource:
        unlock_conditions = recipeSource[name]

    if name in tv_recipes:
        unlock_conditions = f"Queen of Sauce TV Channel on {tv_recipes[name]}."

    cooking_recipes[f"{itemID}"] = {
        "itemID": itemID,
        "unlockConditions": unlock_conditions,
        "ingredients": ingredients,
    }

with open("../../data/cooking.json", "w") as f:
    json.dump(cooking_recipes, f, separators=(",", ":"))

if len(unknowns) > 0:
    for u in unknowns:
        print(u)

#!/usr/bin/env python3

# Purpose: Get all the recipes needed to cook for achievement, along with their
#          unlock conditions and ingredients
# Result is saved to data/cooking.json
# { itemID: { ingredients: [{ itemID, quantity }], unlockConditions: str, itemID: int } }
#
# Content Files used: CookingRecipes.json, data/objects.json, TV/CookingChannel.json
# Wiki Pages used: None

import json

from tqdm import tqdm

from helpers.models import Object, Recipe
from helpers.utils import load_content, load_data, save_json, get_tv_airing_date

# load the content files
OBJECTS: dict[str, Object] = load_data("objects.json")
COOKING_RECIPES: dict[str, str] = load_content("CookingRecipes.json")
TV_RECIPES: dict[str, str] = load_content("TV/CookingChannel.json")

# hardcoded checks for recipes with unusual unlock conditions
# l 100, null
recipeSource = {
    "Cookies": "Evelyn (4-heart event).",
    "Triple Shot Espresso": "Stardrop Saloon for 5,000g.",
    "Ginger Ale": "Dwarf Shop in Volcano Dungeon for 1,000g.",
    "Banana Pudding": "Island Trader for 30 Bone Fragments.",
    "Tropical Curry": "Ginger Island Resort for 2,000g.",
}


def build_airing_dates() -> dict[str, str]:
    """Build the map of recipe names to their TV airing dates."""

    # { name: tv_air_date }
    airing_dates = {}
    for k, v in TV_RECIPES.items():
        name = v.split("/")[0]
        airing_dates[name] = get_tv_airing_date(int(k))

    return airing_dates


def get_cooking_recipes() -> tuple[dict[str, Recipe], dict[str, str], list[str]]:
    translations = {}
    unknowns = []
    output: dict[str, Recipe] = {}

    airing_dates = build_airing_dates()

    for k, v in tqdm(COOKING_RECIPES.items()):
        fields = v.split("/")

        # find which items have a different name in the objects.json
        name = OBJECTS[fields[2]]["name"]
        if k != name:
            # this means that the name in Recipes was different than the Object name.
            # we want to use the name from objects.json
            translations[k] = name

        ingredients = []
        # create pairs of (itemID, quantity)
        ingr = fields[0]
        i = iter(ingr.split(" "))
        pairs = map(" ".join, zip(i, i))

        for p in pairs:
            itemID, quantity = p.split(" ")
            ingredients.append({"itemID": itemID, "quantity": int(quantity)})

        itemID = fields[2]  # yield

        unlock_conditions = fields[3].split(" ")
        if unlock_conditions[0] == "default":
            unlock_conditions = "Starter Recipe - no steps required!"
        elif unlock_conditions[0] == "f":  # unlocked through friendship
            npc = unlock_conditions[1]
            hearts = unlock_conditions[2]
            unlock_conditions = f"Reach {hearts} hearts with {npc}."
        elif unlock_conditions[0] == "l":  # player level
            # max farmer level is 25 so anything over that, check for unknowns
            # if the recipe is not in the recipeSource or airing_dates, it's unknown
            if int(unlock_conditions[1]) > 25:
                if name not in recipeSource and name not in airing_dates:
                    unknowns.append(
                        f"{name}: Unknown unlock condition: {unlock_conditions}"
                    )
                    unlock_conditions = "Unknown"
            else:
                unlock_conditions = f"Reach farmer level {unlock_conditions[1]}."

        elif unlock_conditions[0] == "s":  # skill level
            skill = unlock_conditions[1]
            level = unlock_conditions[2]
            unlock_conditions = f"Reach level {level} in {skill} skill."
        else:

            if name not in recipeSource and name not in airing_dates:
                unknowns.append(
                    f"{name}: Unknown unlock condition: {unlock_conditions}"
                )
                unlock_conditions = "Unknown"

        if name in recipeSource:
            unlock_conditions = recipeSource[name]

        if name in airing_dates:
            unlock_conditions = airing_dates[name]

        output[itemID] = {
            "ingredients": ingredients,
            "itemID": itemID,
            "minVersion": OBJECTS[itemID]["minVersion"],
            "unlockConditions": unlock_conditions,
        }

    return output, translations, unknowns


if __name__ == "__main__":
    recipes, translations, unknowns = get_cooking_recipes()

    save_json(recipes, "cooking.json", sort=True)

    if len(unknowns) > 0:
        print("Unknown unlock conditions: ")
        for u in unknowns:
            print(u)
        print()

    print("Translations:")
    print(json.dumps(translations, indent=2))

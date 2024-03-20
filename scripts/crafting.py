# Purpose: Get all the recipes needed to craft for achievement, along with their
#          unlock conditions and ingredients. Scrape the wiki for any unknowns
# Result is saved to data/crafting.json
# { itemID: { ingredients: [{ itemID, quantity }], unlockConditions: str, itemID: str, isBigCraftale: bool } }
#
# Content Files used: CraftingRecipes.json, data/objects.json, data/big_craftables.json
# Wiki Pages used: stardewvalleywiki.com/<name>, https://stardewvalleywiki.com/Modding:Recipe_data

import re
import json
import requests
import unicodedata

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.utils import load_content, load_data, save_json
from helpers.models import CraftingRecipe, Object, BigObject

# Load the content files
OBJECTS: dict[str, Object] = load_data("objects.json")
BIG_CRAFTABLES: dict[str, BigObject] = load_data("big_craftables.json")
CRAFTING_RECIPES: dict[str, str] = load_content("CraftingRecipes.json")

SKILLS = set(["Farming", "Fishing", "Foraging", "Mining", "Combat", "Luck"])
# recipes that are excluded from achievements (currently only one as of 1.6)
# See StardewValley.Stats.cs::checkForCraftingAchievements()
SKIP = set(["Wedding Ring"])

# hardcoding recipe sources for new 1.6 content, since some of them have unlock conditions set to l 2 (????)
# in the future we can scrape the wiki for these
ITEMS_1_6 = {
    "StatueOfBlessings": "Claim Farming Mastery rewards in Mastery Cave",
    "StatueOfTheDwarfKing": "Claim Mining Mastery rewards in Mastery Cave",
    "HeavyFurnace": "Claim Mining Mastery rewards in Mastery Cave",
    "ChallengeBait": "Claim Fishing Mastery rewards in Mastery Cave",
    "MysticTreeSeed": "Claim Foraging Mastery rewards in Mastery Cave",
    "TreasureTotem": "Claim Foraging Mastery rewards in Mastery Cave",
    "Anvil": "Claim Combat Mastery rewards in Mastery Cave",
    "MiniForge": "Claim Combat Mastery rewards in Mastery Cave",
    "BlueGrassStarter": "Qi's Walnut Room for 40 Qi Gems",
    "BigChest": "Carpenter's Shop for 5000g",
    "BigStoneChest": "Dwarf for 5000g",
    "Dehydrator": "Pierre's for 5000g",
    "FishSmoker": "Willy's Shop for 10000g",
}


def get_crafting_recipes() -> (
    tuple[dict[str, CraftingRecipe], dict[str, str], list[str], list[str]]
):
    """Get the data with all the crafting recipes and their unlock conditions and ingredients.

    Returns:
        tuple[dict[str, CraftingRecipe], dict[str, str], list[str], list[str]]: Crafting Recipes, translations, unknowns, duplicates
    """
    duplicates = []
    unknowns = []
    translations = {}
    output: dict[str, CraftingRecipe] = {}

    for k, v in tqdm(CRAFTING_RECIPES.items()):
        if k in SKIP:
            continue

        fields = v.split("/")
        itemID = fields[2].split(" ")[0]  # yield is "itemID amount"
        is_big_craftable = fields[3] == "true"

        if is_big_craftable:
            name = BIG_CRAFTABLES[itemID]["name"]
        else:
            name = OBJECTS[itemID]["name"]

        if k != name:
            # we want to use the name from objects.json, but for something like
            # transmute (which has no name in objects.json), we want to use the key
            # case by case basis so we'll print this at the end and use it in the frontend
            translations[k] = name

        # now we'll find the ingredients needed to craft the item
        ingredients = []
        ingr = fields[0]
        i = iter(ingr.split(" "))
        pairs = map(" ".join, zip(i, i))
        for p in pairs:
            item_id, quantity = p.split(" ")
            ingredients.append({"itemID": item_id, "quantity": int(quantity)})

        # find the unlock conditions
        # possible options from wiki/Modding:Recipe_data
        unlockConditions = fields[4].split(" ")
        if unlockConditions[0] in SKILLS:
            skill = unlockConditions[0]
            level = unlockConditions[1]
            unlockConditions = f"Reach level {level} in {skill} skill."
        elif unlockConditions[0] == "s":
            skill = unlockConditions[1]
            level = unlockConditions[2]
            unlockConditions = f"Reach level {level} in {skill} skill."
        elif unlockConditions[0] == "l":
            if unlockConditions[1] == "0":
                unlockConditions = "Unknown"
            else:
                try:
                    lvl = int(unlockConditions[1])
                    if (
                        lvl > 25
                    ):  # max level is 25 as of 1.6 since luck skill is not used
                        unlockConditions = "Unknown"
                    else:
                        unlockConditions = f"Reach farmer level {unlockConditions[1]}."
                except ValueError:
                    unlockConditions = "Unknown"
        elif unlockConditions[0] == "f":
            npc = unlockConditions[1]
            hearts = unlockConditions[2]
            unlockConditions = f"Reach {hearts} hearts with {npc}."
        elif unlockConditions[0] == "null":
            unlockConditions = "Unknown"
        elif unlockConditions[0] == "default":
            unlockConditions = "Starter Recipe - no steps required."

        # hardcoded unlock conditions for new 1.6 content
        if itemID in ITEMS_1_6:
            unlockConditions = ITEMS_1_6[itemID]

        # now we'll find the unlock conditions for unknowns
        if unlockConditions == "Unknown":
            # scrape the wiki for the unlock conditions if unknown
            wiki_url = f"https://stardewvalleywiki.com/{name}"
            page = requests.get(wiki_url)
            soup = BeautifulSoup(page.text, "html.parser")

            # try and find the row header for the recipe
            elem = soup.find("td", string=re.compile("Recipe Source"))

            if not elem:
                unknowns.append(name)
                output[itemID] = {
                    "ingredients": ingredients,
                    "isBigCraftable": is_big_craftable,
                    "itemID": itemID,
                    "minVersion": (
                        OBJECTS[itemID]["minVersion"]
                        if not is_big_craftable
                        else BIG_CRAFTABLES[itemID]["minVersion"]
                    ),
                    "unlockConditions": unlockConditions,
                }
                continue

            # remove hidden span tags which mess up the wiki scraping
            next_elem = elem.find_next("td")
            for span in next_elem.find_all("span", {"style": "display: none;"}):
                span.decompose()

            unlockConditions = unicodedata.normalize(
                "NFKD", next_elem.get_text().strip()
            )

            # hardcoded way to clean up the string but don't know a better way
            # pretty special cases so idk if theres a way to generalize
            if unlockConditions.startswith("Qi's"):
                unlockConditions = unlockConditions.replace("  ", " ")
                if unlockConditions.endswith(")"):
                    unlockConditions = unlockConditions.replace(
                        " ( 20)", "for 20 Qi Gems"
                    )
                else:
                    unlockConditions = unlockConditions + " Qi Gems"

        if itemID not in output:
            output[itemID] = {
                "ingredients": ingredients,
                "isBigCraftable": is_big_craftable,
                "itemID": itemID,
                "minVersion": (
                    OBJECTS[itemID]["minVersion"]
                    if not is_big_craftable
                    else BIG_CRAFTABLES[itemID]["minVersion"]
                ),
                "unlockConditions": unlockConditions,
            }
        else:
            duplicates.append((name, itemID))

    return output, translations, unknowns, duplicates


if __name__ == "__main__":
    recipes, translations, unknowns, duplicates = get_crafting_recipes()

    print("NUMBER OF RECIPES: ", len(recipes))
    assert len(recipes) == 149  # 129 as of 1.5, 149 as of 1.6 with new content
    save_json(recipes, "crafting.json", sort=True, minify=True)

    if len(unknowns) > 0:
        print("Unknown unlock conditions: ")
        for u in unknowns:
            print(u)
        print()

    if len(duplicates) > 0:
        print("Duplicates: ")
        for d in duplicates:
            print(d)
        print()

    print("Translations: ")
    print(json.dumps(translations, indent=2))

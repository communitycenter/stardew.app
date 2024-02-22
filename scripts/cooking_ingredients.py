# Purpose: Get a count of all the ingredients needed to cook all the recipes
# Result is saved to data/cooking_ingredients.json
# { itemID: { usedIn: [id], quantity: int } }
#
# Content Files used: CookingRecipes.json
# Wiki Pages used: https://stardewvalleywiki.com/Modding:Recipe_data

from tqdm import tqdm

from helpers.models import TrackedIngredient
from helpers.utils import load_content, save_json

# load the content files
COOKING_RECIPES = load_content("CookingRecipes.json")


def get_cooking_ingredients() -> dict[str, TrackedIngredient]:
    output: dict[str, TrackedIngredient] = {}

    for value in tqdm(COOKING_RECIPES.values()):
        fields = value.split("/")
        yieldID = fields[2]

        # loop through the ingrs and increase the count for each
        # to do this, we'll create pairs of (itemID, quantity)
        # the ingrs field is a space separated list of numbers in pairs (itemID, quantity)
        i = iter(fields[0].split(" "))
        pairs = map(" ".join, zip(i, i))
        for p in pairs:
            itemID, quantity = p.split(" ")

            # check if itemID has been initialized, initialize if not
            if not output.get(itemID):
                output[itemID] = {}
                output[itemID]["quantity"] = 0
                output[itemID]["usedIn"] = []

            output[itemID]["quantity"] = int(quantity) + output.get(itemID, {}).get(
                "quantity", 0
            )

            # for each ingredient, add the yieldID to the usedIn list
            output[itemID]["usedIn"].append(yieldID)

    return output


if __name__ == "__main__":
    ingredients = get_cooking_ingredients()

    # https://stardewvalleywiki.com/Cooking (a minimum of 87 different types of items used)
    print(len(ingredients))  # 88 as of 1.6 new content, 87 in 1.5
    assert len(ingredients) == 88
    save_json(ingredients, "cooking_ingredients.json", sort=True)

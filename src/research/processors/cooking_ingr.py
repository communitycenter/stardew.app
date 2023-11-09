import json

from typing import TypedDict


class Ingredient(TypedDict):
    quantity: int
    usedIn: list[int]


# -4 = Any fish
# -5 = Any Egg
# -6 = Any Milk
with open("../raw_data/CookingRecipes.json", "r") as f:
    data: dict[str, str] = json.load(f)

# { str: { quantity: int, usedIn: int[] }}
ingredients: dict[str, Ingredient] = {}
for name, value in data.items():
    fields = value.split("/")
    yieldID = fields[2]
    # loop through ingredients, add itemID to dict if not there already
    # and increase the count

    # create pairs of (itemID, quantity)
    i = iter(fields[0].split(" "))
    pairs = map(" ".join, zip(i, i))
    for pair in pairs:
        itemID, quantity = pair.split(" ")

        # check if itemID has been initialized, initialize if not
        if not ingredients.get(itemID):
            ingredients[itemID] = {}
            ingredients[itemID]["usedIn"] = []

        ingredients[itemID]["quantity"] = int(quantity) + ingredients.get(
            itemID, {}
        ).get("quantity", 0)

        # add the yieldID to the usedIn list
        ingredients[itemID]["usedIn"].append(int(yieldID))

with open("../../data/cooking_ingredients.json", "w") as f:
    json.dump(ingredients, f, indent=2)

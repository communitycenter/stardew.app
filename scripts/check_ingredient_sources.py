# Purpose: Make sure every cooking and crafting ingredient has a way to obtain it.
# Checks src/data/ingredient_sources.json against the recipe data files.
#
# Fish (anything in data/fish.json) are skipped because their sources are
# built from fish.json itself (locations, seasons, time and weather).
#
# Usage: python scripts/check_ingredient_sources.py

import json
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data"
VALID_TYPES = {
    "shop",
    "forage",
    "crop",
    "animal",
    "machine",
    "craft",
    "cook",
    "mining",
    "monster",
    "tree",
    "island",
    "fish",
    "other",
}


def load(name: str) -> dict:
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def main() -> int:
    sources = load("ingredient_sources.json")
    fish = load("fish.json")

    ingredients: set[str] = set()
    for file in ("cooking.json", "crafting.json"):
        for recipe in load(file).values():
            for ingredient in recipe["ingredients"]:
                ingredients.add(ingredient["itemID"])

    missing = sorted(i for i in ingredients if i not in sources and i not in fish)
    unused = sorted(i for i in sources if i not in ingredients)
    bad_types = sorted(
        f"{item}: {s['type']}"
        for item, entries in sources.items()
        for s in entries
        if s.get("type") not in VALID_TYPES or not s.get("text")
    )

    print(f"{len(ingredients)} ingredients, {len(sources)} with curated sources")
    for label, items in (
        ("Missing sources", missing),
        ("Sources for items no recipe uses", unused),
        ("Invalid entries", bad_types),
    ):
        if items:
            print(f"{label}: {', '.join(items)}")

    return 1 if missing or bad_types else 0


if __name__ == "__main__":
    sys.exit(main())

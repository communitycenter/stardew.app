# Purpose: parse Machines.json for processing times (in-game minutes), keyed by machine ID
# Result is saved to data/machines.json as { name, minutes, byOutput: { itemID: minutes } }
#
# Content Files used: Machines.json
# Data Files used: big_craftables.json

from collections import defaultdict
from statistics import mean

from tqdm import tqdm

from helpers.models import Machine
from helpers.utils import load_content, load_data, save_json

MACHINES: dict[str, dict] = load_content("Machines.json")
BIG_CRAFTABLES: dict[str, dict] = load_data("big_craftables.json")

MINUTES_PER_DAY = 1600

# flavored outputs are saved under the base item's ID
FLAVORED_ITEM_IDS = {
    "Honey": "340",
    "Wine": "348",
    "Jelly": "344",
    "Pickle": "342",
    "Juice": "350",
    "Roe": "812",
    "AgedRoe": "447",
    "Bait": "SpecificBait",
    "DriedFruit": "DriedFruit",
    "DriedMushroom": "DriedMushrooms",
    "SmokedFish": "SmokedFish",
}


def rule_minutes(rule: dict) -> int | None:
    minutes = rule.get("MinutesUntilReady", -1)
    if minutes > 0:
        return minutes
    days = rule.get("DaysUntilReady", -1)
    if days > 0:
        return days * MINUTES_PER_DAY
    if all(item.get("OutputMethod") for item in rule.get("OutputItem") or []):
        return None  # code-driven (Cask)
    return MINUTES_PER_DAY  # daily rules (statues, coffee maker)


def output_id(output: dict) -> str | None:
    item_id = output.get("ItemId")
    if not item_id:
        return None
    if item_id.startswith("(O)"):
        return item_id[3:]
    if item_id.startswith("FLAVORED_ITEM "):
        flavor = item_id.split(" ")[1]
        return FLAVORED_ITEM_IDS.get(flavor)
    return None


def get_machines() -> dict[str, Machine]:
    output: dict[str, Machine] = {}
    for key, value in tqdm(MACHINES.items()):
        machine_id = key[len("(BC)") :]
        name = BIG_CRAFTABLES.get(machine_id, {}).get("name", machine_id)

        rules = value.get("OutputRules") or []
        all_minutes: list[int] = []
        by_output: dict[str, list[int]] = defaultdict(list)
        for rule in rules:
            minutes = rule_minutes(rule)
            if minutes is None:
                continue
            all_minutes.append(minutes)
            for item in rule.get("OutputItem") or []:
                item_id = output_id(item)
                if item_id:
                    by_output[item_id].append(minutes)

        default = round(mean(all_minutes)) if all_minutes else None

        # per-item overrides, e.g. Crystalarium "ITEM_ID Target (O)72"
        for modifier in value.get("ReadyTimeModifiers") or []:
            condition = modifier.get("Condition") or ""
            parts = condition.split(" ")
            if len(parts) != 3 or parts[0] != "ITEM_ID" or not parts[2].startswith("(O)"):
                continue
            item_id = parts[2][3:]
            amount = modifier.get("Amount", 0)
            if modifier.get("Modification") == "Set":
                by_output[item_id] = [int(amount)]
            elif modifier.get("Modification") == "Multiply" and default:
                by_output[item_id] = [int(default * amount)]

        output[machine_id] = {
            "name": name,
            "minutes": default,
            # average when inputs differ (Oil Maker)
            "byOutput": {
                item_id: round(mean(minutes))
                for item_id, minutes in by_output.items()
            },
        }

    return output


if __name__ == "__main__":
    output = get_machines()
    save_json(output, "machines.json", sort=True)

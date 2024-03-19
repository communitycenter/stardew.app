# Purpose: Get all relevant information about the powers in the game for use in the frontend.
# Result is saved to data/powers.json
#
# References:
#   - StardewValley.GameStateQuery.cs::PLAYER_HAS_MAIL()
#   - StardewValley.GameStateQuery.cs::PLAYER_HAS_SEEN_EVENT()
#   - StardewValley.GameStateQuery.cs::PLAYER_STAT()
# Output:
# { powerID: { name, description, iconURL, type, flag, playerKey } }
# Content Files used: Powers.json, Strings/Objects.json, Strings/1_6_Strings.json, Strings/StringsFromCSFiles.json
# Wiki Pages used: none

from tqdm import tqdm

from helpers.models import ContentPowerModel, Power
from helpers.utils import load_content, get_string, save_json

POWERS: dict[str, ContentPowerModel] = load_content("Powers.json")


def get_powers() -> dict[str, Power]:
    output: dict[str, Power] = {}

    for id, power in tqdm(POWERS.items()):

        # in the future we can just adjust these to add new versions
        if power["TexturePath"].endswith("Cursors_1_6") or power[
            "TexturePath"
        ].endswith("Objects_2"):
            minVersion = "1.6.0"
        else:
            minVersion = "1.5.0"

        name = get_string(power["DisplayName"])
        description = get_string(power["Description"])

        query_string = power["UnlockedCondition"].split(" ")

        func = query_string[0]
        playerKey = query_string[1]
        flag = query_string[2]

        match func:
            case "PLAYER_HAS_MAIL":
                type = "mail"
            case "PLAYER_HAS_SEEN_EVENT":
                type = "event"
            case "PLAYER_STAT":
                type = "stat"
            case _:
                type = "unknown"
                print(f"Unknown power type: {func}")
                continue

        output[id] = {
            "description": description,
            "flag": flag,
            "minVersion": minVersion,
            "name": name,
            "playerKey": playerKey,
            "type": type,
        }

    return output


if __name__ == "__main__":
    powers = get_powers()
    save_json(powers, "powers.json", sort=False)

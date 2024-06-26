import os
import json

from typing import Any, Dict, Literal, Optional
from datetime import datetime

from helpers.models import ContentObjectModel


def load_content(file_name: str, version: Literal["1.6 alpha"] = None) -> dict:
    """Loads a json file from the content directory and returns it as a dictionary

    Args:
        file_name (str): The name of the json file. Ex: "Achievements.json"

    Returns:
        dict: The json file as a dictionary
    """
    if not file_name.endswith(".json"):
        file_name += ".json"

    if not version:
        # as of now is the new content 1.6 beta
        content_path = os.path.join(
            os.path.dirname(__file__), "..", "content", file_name
        )
        with open(content_path, "r") as f:
            return json.load(f)

    if version == "1.6 alpha":
        # we'll use this to flag new content that's only available in the 1.6 beta
        # EX: if key not in 1.6alpha, then it's new content
        content_path = os.path.join(
            os.path.dirname(__file__), "..", "content", "1-6_alpha", file_name
        )
        with open(content_path, "r") as f:
            return json.load(f)


def load_data(file_name: str) -> dict:
    """Loads a json file from the data directory and returns it as a dictionary

    Args:
        file_name (str): The name of the json file. Ex: "cooking.json"

    Returns:
        dict: The json file as a dictionary
    """
    data_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "src", "data", file_name
    )
    with open(data_path, "r") as f:
        return json.load(f)


strings_cache = {}


def load_strings(file_name: str) -> dict[str, str]:
    """Loads a json file from the Strings directory and returns it as a dictionary

    Args:
        file_name (str): The name of the json file. Ex: "StringsFromCSFiles.json"

    Returns:
        dict: The json file as a dictionary
    """

    if not file_name.endswith(".json"):
        file_name += ".json"

    if file_name in strings_cache:
        return strings_cache[file_name]

    strings_path = os.path.join(
            os.path.dirname(__file__), "..", "content", "Strings", file_name
    )

    with open(strings_path, "r") as f:
        strings_cache[file_name] = json.load(f)
        return strings_cache[file_name]


def save_json(
    data: dict[str, Any], file_name: str, sort: bool = True, minify: bool = False
) -> None:
    """Saves a dictionary to a json file in the data directory

    Args:
        data (dict): The dictionary to save.
        file_name (str): The name of the json file.
        sort (bool, optional): Whether or not to sort the keys. Defaults to True.
    """
    data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "src", "data")
    output_path = os.path.join(data_dir, file_name)

    if not sort:
        if not minify:
            with open(output_path, "w") as f:
                json.dump(data, f, indent=2, sort_keys=False)
            return
        else:
            with open(output_path, "w") as f:
                json.dump(data, f, separators=(",", ":"), sort_keys=False)
            return

    # we'll split the keys into numeric and non-numeric keys and sort them separately
    numeric_keys = [key for key in data.keys() if key.startswith("-") or key.isdigit()]
    non_numeric_keys = [key for key in data.keys() if not key.isdigit()]

    # sort the numeric keys
    numeric_keys.sort(key=lambda x: int(x))

    # sort the non-numeric keys
    non_numeric_keys.sort()

    # combine the sorted keys
    sorted_keys = numeric_keys + non_numeric_keys
    if minify:
        with open(output_path, "w") as f:
            json.dump(
                {key: data[key] for key in sorted_keys},
                f,
                sort_keys=False,
                separators=(",", ":"),
            )
    else:
        with open(output_path, "w") as f:
            json.dump(
                {key: data[key] for key in sorted_keys},
                f,
                indent=2,
                sort_keys=False,
            )


def GetCategoryDisplayName(
    category: int, StringsFromCSFiles: dict[str, str], Strings_1_6: dict[str, str]
) -> str:
    """Returns the human readable category display name for a given category number.

    See: `StardewValley\\Object.cs::GetCategoryDisplayName()`

    Args:
        category (int): The item category number (ex: -2 for Minerals)
        StringsFromCSFiles (dict[str, str]): The loaded StringsFromCSFiles.json
        Strings_1_6 (dict[str, str]): The loaded 1_6_Strings.json

    Returns:
        str: The human readable category display name (ex: "Minerals")
    """

    match category:
        case -97:
            return StringsFromCSFiles.get("Boots.cs.12501")
        case -100:
            return StringsFromCSFiles.get("category_clothes")
        case -96:
            return StringsFromCSFiles.get("Ring.cs.1")
        case -99:
            return StringsFromCSFiles.get("Tool.cs.14307")
        case -12 | -2:
            return StringsFromCSFiles.get("Object.cs.12850")
        case -75:
            return StringsFromCSFiles.get("Object.cs.12851")
        case -4:
            return StringsFromCSFiles.get("Object.cs.12852")
        case -25 | -7:
            return StringsFromCSFiles.get("Object.cs.12853")
        case -79:
            return StringsFromCSFiles.get("Object.cs.12854")
        case -74:
            return StringsFromCSFiles.get("Object.cs.12855")
        case -19:
            return StringsFromCSFiles.get("Object.cs.12856")
        case -21:
            return StringsFromCSFiles.get("Object.cs.12857")
        case -22:
            return StringsFromCSFiles.get("Object.cs.12858")
        case -24:
            return StringsFromCSFiles.get("Object.cs.12859")
        case -20:
            return StringsFromCSFiles.get("Object.cs.12860")
        case -27 | -26:
            return StringsFromCSFiles.get("Object.cs.12862")
        case -8:
            return StringsFromCSFiles.get("Object.cs.12863")
        case -18 | -14 | -6 | -5:
            return StringsFromCSFiles.get("Object.cs.12864")
        case -80:
            return StringsFromCSFiles.get("Object.cs.12866")
        case -28:
            return StringsFromCSFiles.get("Object.cs.12867")
        case -16 | -15:
            return StringsFromCSFiles.get("Object.cs.12868")
        case -81:
            return StringsFromCSFiles.get("Object.cs.12869")
        case -102:
            return Strings_1_6.get("Book_Category")
        case -103:
            return Strings_1_6.get("skillBook_Category")
        case _:
            return ""


def getCategoryName(
    Type: str,
    Category: int,
    StringsFromCSFiles: dict[str, str],
    Strings_1_6: dict[str, str],
) -> str:
    """Returns the human readable category display name for a given category number.

    See: `StardewValley\\Object.cs::getCategoryName()`

    We'll have to pass in the arguments Type and Category since we don't have access to the Object class for items.

    Args:
        Type (str): The item's general type like 'Arch' or 'Minerals'
        Category (int): The item category
        StringsFromCSFiles (dict[str, str]): THe loaded StringsFromCSFiles.json
        Strings_1_6 (dict[str, str]): The loaded 1_6_Strings.json

    Returns:
        str: The human readable category display name (ex: "Minerals")
    """
    if Type == "Arch":
        return StringsFromCSFiles.get("Object.cs.12849")
    elif Type == "Litter" and Category == -999:
        # category -999 is litter, but the game doesn't provide a string for it
        return "Litter"

    category_display_name = GetCategoryDisplayName(
        Category, StringsFromCSFiles, Strings_1_6
    )

    # some categories don't have a display name 😵‍💫
    if category_display_name == "":
        return Type

    return category_display_name


def get_string(tokenized_str: str) -> Optional[str]:
    """Uses a tokenized string to return the actual string from a JSON Strings file.

    Args:
        tokenized_str (str): A tokenized string. Ex: `[LocalizedText Strings\\Objects:MagicRockCandy_Name]`

    Returns:
        str: The actual string. Ex: 'Magic Rock Candy'
    """
    if tokenized_str == "":
        return None

    # Tokenized strings are in the format: [LocalizedText Strings\<File>:<key>]
    # although apparently sometimes, they look like: [LocalizedText Strings\\<File>:<key>]
    if tokenized_str.count("\\") == 2:
        file_name = tokenized_str.split(":")[0].split("\\\\")[1]
    elif tokenized_str.count("\\") == 1:
        file_name = tokenized_str.split(":")[0].split("\\")[1]
    key = tokenized_str.split(":")[1][:-1]

    Strings = load_strings(file_name + ".json")
    return Strings.get(key)


def get_tv_airing_date(key: int) -> str:
    """Returns the string for when the recipe with the given key will air on TV.

    Args:
        key (int): The key of the recipe in the JSON file.

    Returns:
        str: A string in the format "Spring 7, Year 1".
    """
    # Dropping key from 1 indexed to 0 indexed
    key_idx = key - 1
    day_key = key_idx % 4
    day = (day_key + 1) * 7

    seasons = ["Spring", "Summer", "Fall", "Winter"]
    season_idx = key_idx // 4
    season = seasons[season_idx % 4]

    year = key_idx // 16 + 1

    return f"{season} {day}, Year {year}"


def convert_time(time: str) -> str:
    """Converts a string from 24-hour time to 12-hour time.

    Args:
        time (str): The time from fish data. Ex: "1200"

    Returns:
        str: The time in 12-hour format. Ex: "12PM"
    """
    if time == "2400":
        return "12AM"
    elif int(time) > 2400:
        time = time[:-2]

    if len(time) == 3: 
        time = "0" + time  
    
    formatted_time = datetime.strptime(time, "%H%M").strftime("%I%p")
    
    if formatted_time.startswith('0'):
        formatted_time = formatted_time[1:]
    
    return formatted_time


def isPotentialBasicShipped(
    itemId: str, category: int, objectType: str, OBJECTS: dict[str, ContentObjectModel]
) -> bool:
    """See `StardewValley/Object.cs::isPotentialBasicShipped()`

    Args:
        itemId (str): the item's unqualified item id
        category (int): the item's category
        objectType (str): the item's type
        OBJECTS (dict): The content file `Objects.json` loaded as a dictionary

    Returns:
        bool: whether the item is a potential basic shipped item
    """
    if itemId == "433":
        return True

    match objectType:
        case "Arch" | "Fish" | "Minerals" | "Cooking":
            return False
        case _:
            match category:
                case (
                    -999
                    | -103
                    | -102
                    | -96
                    | -74
                    | -29
                    | -24
                    | -22
                    | -21
                    | -20
                    | -19
                    | -14
                    | -12
                    | -8
                    | -7
                    | -2
                    | 0
                ):
                    return False
                case _:
                    if OBJECTS.get(itemId).get("ExcludeFromShippingCollection"):
                        return False
                    return True


def has_dangerous_variant(name: str) -> bool:
    """Returns true if the monster has a dangerous variant.

    Args:
        name (str): The name of the monster.

    Returns:
        bool: True if the monster has a dangerous variant.
    """
    monsters_path = os.path.join(os.path.dirname(__file__), "..", "content", "Monsters")

    if os.path.exists(os.path.join(monsters_path, f"{name}_dangerous.png")):
        return True

def get_fish_info(fish_locations: Dict[str, Any]) -> Dict[str, Any]:
    """Returns information about the fish including seasons, minimum fishing level, etc.
    Args:
        fish_locations (dict): The locations where the fish can be caught.

    Returns:
        dict: A dictionary containing information about the fish, including seasons, minimum fishing level, etc.
    """
    info = {"seasons": set(), "min_level": 0}
    for location, location_details in fish_locations.items():
        if location in ['IslandSouth', 'IslandSouthEast', 'IslandSouthEastCave', 'IslandWest']:
            continue

        if location == "Submarine" and len(fish_locations) == 1:
            info["seasons"].add("Winter")
        elif location == "Submarine":
            info["seasons"].add("Winter (Submarine)")

        if location_details["MinLevel"] and location_details["MinLevel"] > info["min_level"]:
            info["min_level"] = location_details["MinLevel"]

        if location_details["Season"]:
            info["seasons"].add(location_details["Season"])
        elif location_details["Condition"] and "LOCATION_SEASON Here" in location_details["Condition"]:
            condition_string = location_details["Condition"].replace("LOCATION_SEASON Here", "").strip()
            info["seasons"].update(condition_string.split())
            
    if "winter" in info["seasons"] and "Winter (Submarine)" in info["seasons"]:
        info["seasons"].remove("Winter (Submarine)")

    if not info["seasons"] or (info["seasons"] == {"Winter (Submarine)"} and len(fish_locations) > 1):
        if "Winter (Submarine)" in info["seasons"]:
            info["seasons"].remove("Winter (Submarine)")
        info["seasons"].update({"Spring", "Summer", "Fall", "Winter"})


    return info
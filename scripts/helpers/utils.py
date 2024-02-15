import os
import json

from datetime import datetime


def load_content(file_name: str) -> dict:
    """Loads a json file from the content directory and returns it as a dictionary

    Args:
        file_name (str): The name of the json file. Ex: "Achievements.json"

    Returns:
        dict: The json file as a dictionary
    """
    content_path = os.path.join(os.path.dirname(__file__), "..", "content", file_name)
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


def load_strings(file_name: str) -> dict[str, str]:
    """Loads a json file from the Strings directory and returns it as a dictionary

    Args:
        file_name (str): The name of the json file. Ex: "StringsFromCSFiles.json"

    Returns:
        dict: The json file as a dictionary
    """
    strings_path = os.path.join(
        os.path.dirname(__file__), "..", "content", "Strings", file_name
    )
    with open(strings_path, "r") as f:
        return json.load(f)


def save_json(data: dict, file_name: str, sort: bool = True) -> None:
    """Saves a dictionary to a json file in the data directory

    Args:
        curr_file (str): The path to the current script. Use __file__.
        data (dict): The dictionary to save.
        file_name (str): The name of the json file.
        sort (bool, optional): Whether or not to sort the keys. Defaults to True.
    """
    data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "src", "data")
    output_path = os.path.join(data_dir, file_name)

    if not sort:
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2, sort_keys=False)
        return

    with open(output_path, "w") as f:
        json.dump({int(x): data[x] for x in data.keys()}, f, indent=2, sort_keys=True)


def GetCategoryDisplayName(category: int, StringsFromCSFiles: dict[str, str]) -> str:
    """Returns the human readable category display name for a given category number.

    See: `StardewValley\\Object.cs::GetCategoryDisplayName()`

    Args:
        category (int): The item category number (ex: -2 for Minerals)

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
        case _:
            return ""


def getCategoryName(
    Type: str, Category: int, StringsFromCSFiles: dict[str, str]
) -> str:
    """Returns the human readable category display name for a given category number.

    See: `StardewValley\\Object.cs::getCategoryName()`

    We'll have to pass in the arguments Type and Category since we don't have access to the Object class for items.

    Args:
        Type (str): The item's general type like 'Arch' or 'Minerals'
        Category (int): The item category
        StringsFromCSFiles (dict[str, str]): THe loaded StringsFromCSFiles.json

    Returns:
        str: The human readable category display name (ex: "Minerals")
    """
    if Type == "Arch":
        return StringsFromCSFiles.get("Object.cs.12849")
    elif Type == "Litter" and Category == -999:
        # category -999 is litter, but the game doesn't provide a string for it
        return "Litter"

    category_display_name = GetCategoryDisplayName(Category, StringsFromCSFiles)

    # some categories don't have a display name 😵‍💫
    if category_display_name == "":
        return Type

    return category_display_name


def get_string(tokenized_str: str, Strings: dict[str, str]) -> str:
    """Uses a tokenized string to return the actual string from StringsFromCSFiles.json

    Args:
        tokenized_str (str): A tokenized string. Ex: `[LocalizedText Strings\\Objects:MagicRockCandy_Name]`
        Strings (dict[str, str]): The loaded json file. Ex: `Strings/Objects.json`.

    Returns:
        str: The actual string. Ex: 'Magic Rock Candy'
    """
    # Tokenized strings are in the format: [LocalizedText Strings\<File>:<key>]
    key = tokenized_str.split(":")[1][:-1]
    return Strings.get(key)


def get_tv_airing_date(key: int) -> str:
    """Returns the string for when the recipe with the given key will air on TV.

    Args:
        key (int): The key of the recipe in the JSON file.

    Returns:
        str: A string in the format "Spring 7, Year 1".
    """
    seasons = ["Spring", "Summer", "Fall", "Winter"]
    day = (key * 7) % 28
    if day == 0:
        day = 28

    season_idx = (key - 1) // 4
    season = seasons[season_idx % 4]

    year = (key * 7) // 112 + 1

    return f"{season} {day}, Year {year}"


def convert_time(time: str) -> str:
    """Converts a string from 24-hour time to 12-hour time.

    Args:
        time (str): The time from fish data. Ex: "1200"

    Returns:
        str: The time in 12-hour format. Ex: "12PM"
    """
    return datetime.strptime(time, "%H%M%S").strftime("%-I%p")

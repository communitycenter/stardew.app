import os
import json


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
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2, sort_keys=sort)

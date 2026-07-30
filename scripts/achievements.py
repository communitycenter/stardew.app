#! /usr/bin/env python3

# Purpose: Parsing all achievement info from wiki (iconURL, name, description)
# Result is saved to data/achievements.json
# { name: { iconURL, name, description, id } }
#
# Content Files used: Achievements.json
# Wiki Pages used: https://stardewvalleywiki.com/Achievements

"""
    Instead of processing the game files, we're gonna scrape the wiki for the
    achievements because the game files don't have all the achievements. This
    means that we're not gonna have the accurate achievement IDs, but that's
    not a big deal.
"""
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.utils import save_json, load_content
from helpers.models import Achievement


def get_achievements() -> dict[str, Achievement]:
    # Load the achievements.json file
    achievementsData = load_content("Achievements.json")
    
    # Get the page and relevant table body
    URL = "https://stardewvalleywiki.com/Achievements"
    page = requests.get(URL)
    soup = BeautifulSoup(page.text, "html.parser")
    tbody = soup.find("table", class_="wikitable").find("tbody")  # Get the table body

    id = 0  # This is not the accurate in game ID
    achievements = {}
    # Loop through all the rows
    # For some stupid reason, the first row is the table header
    for tr in tqdm(tbody.find_all("tr")[1:]):
        # handle rows that have two rewards like gourmet chef
        if len(tr.find_all("td")) != 6:
            continue

        # Search the first <img> tag in the first <td> tag
        iconURL = tr.find("td").find("img")["src"]

        # Get the text value of the 3rd and 4th <td> tags
        name = tr.find_all("td")[2].text.strip()
        description = tr.find_all("td")[3].text.strip()
        
        # Attach the game ID to the achievement, if one exists
        game_id = None  # This is the accurate in game ID
        for k, v in achievementsData.items():
            game_name = v.split("^")[0]
            if name.lower() in game_name.lower():
                game_id = k

        # Add the achievement to the dictionary
        achievements[name] = {
            "iconURL": "https://stardewvalleywiki.com" + iconURL,
            "name": name,
            "description": description.replace(" See (note below)", ""),
            "id": id,
            "gameID": int(game_id) if game_id else None,
        }
        id += 1

    return achievements


if __name__ == "__main__":
    achievements = get_achievements()

    # Save the achievements to a json file
    save_json(data=achievements, file_name="achievements.json", sort=False)

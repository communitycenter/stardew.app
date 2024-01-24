# Parsing all achievements from wiki
# iconURL, name, description

"""
    Instead of processing the game files, we're gonna scrape the wiki for the
    achievements because the game files don't have all the achievements. This
    means that we're not gonna have the accurate achievement IDs, but that's
    not a big deal.
"""
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup

from helpers.utils import save_json

URL = "https://stardewvalleywiki.com/Achievements"
page = requests.get(URL)
soup = BeautifulSoup(page.text, "html.parser")
tbody = soup.find("table").find("tbody")  # Get the table body

id = 0
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

    # Add the achievement to the dictionary
    achievements[name] = {
        "iconURL": "https://stardewvalleywiki.com" + iconURL,
        "name": name,
        "description": description.replace(" See (note below)", ""),
        "id": id,  # This is not the accurate in game ID
    }
    id += 1

# Save the achievements to a json file
save_json(data=achievements, file_name="achievements.json", sort=False)

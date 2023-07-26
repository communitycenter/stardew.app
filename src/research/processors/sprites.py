# Scraping sprites from https://stardewvalleywiki.com/Modding:Items/Object_sprites
# we won't import this file on the client side, only for processors

import json
import requests

from tqdm import tqdm
from bs4 import BeautifulSoup


sprites = {}
url = "https://stardewvalleywiki.com/Modding:Items/Object_sprites"
page = requests.get(url)
soup = BeautifulSoup(page.text, "html.parser")

empty_ids = set([23, 31, 173, 291, 925, 927, 929, 931, 932, 933, 934, 935])
i = 0
for a in tqdm(soup.find_all("a", {"class": "image"})):
    # Some of the itemIDs in the table are just empty images or not implemented
    # so we're just gonna skip those
    while i in empty_ids:
        i += 1

    """
    so the <a> tag gives the url to the page which contains a link to the
    48x48 image (why the wiki does this idk). Inside of the <a> tag though,
    theres an <img> tag with a src attribute set to a thumbnail (24x24)
    version of the sprite *with the same name as the 48x48 image*.
    Just need to slightly change the thumbnail url and we can get the 48x48
    version URL without having to make a request for each sprite.

    Ex: src="/mediawiki/images/thumb/1/1d/Green_Slime_Egg.png/24px-Green_Slime_Egg.png"
    we need to convert that to "/mediawiki/images/1/1d/Green_Slime_Egg.png"
    """
    thumbnail_url = a.find("img")["src"]
    iconURL = thumbnail_url.split(".png/")[0].replace("/thumb", "") + ".png"

    sprites[f"{i}"] = f"https://stardewvalleywiki.com{iconURL}"
    i += 1

    with open("./sprites.json", "w") as f:
        json.dump(sprites, f, separators=(",", ":"))

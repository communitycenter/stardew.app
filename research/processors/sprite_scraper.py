# Scraping all sprites from the 
# https://stardewcommunitywiki.com/Modding:Object_data/Sprites

import json
import bs4
import requests

sprites = {}
DEBUG = False

empty_ids = set([23, 31, 173, 291, 925, 927, 929, 931, 932, 933, 934, 935])
i = 0

url = "https://stardewcommunitywiki.com/Modding:Object_data/Sprites"
r = requests.get(url)
soup = bs4.BeautifulSoup(r.text, "html.parser")

for a in soup.find_all("a", {"class": "image"}):
    # some items are empty so we'll just set these to null, the IDs that
    # are empty are just hardcoded by looking at the sprite sheet
    while i in empty_ids:
        sprites[f"{i:03}"] = None
        i += 1
    
    # so the <a> tag gives the url to the page which contains a link to the 
    # 48x48 image (why the wiki does this idk). Inside of the <a> tag though,
    # theres an <img> tag with a src attribute set to a thumbnail (24x24)
    # version of the sprite *with the same name as the 48x48 image*.
    # Just need to slightly change the thumbnail url and we can get the 48x48
    # version URL without having to make a request for each sprite.

    
    # Ex: src="/mediawiki/images/thumb/1/1d/Green_Slime_Egg.png/24px-Green_Slime_Egg.png"
    # we need to convert that to "/mediawiki/images/1/1d/Green_Slime_Egg.png"
    
    thumbnail_url: str = a.find("img")["src"] 
    iconURL = thumbnail_url.split(".png/")[0].replace("/thumb","") + ".png"
    
    sprites[f"{i:03}"] = "https://stardewcommunitywiki.com" + iconURL # {i:03} zero pads the number
    i += 1

if not DEBUG:    
    with open("./data/sprites.json", "w") as file:
        json.dump(sprites, file, indent=4)
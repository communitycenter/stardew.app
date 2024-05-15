#!/usr/bin/env python3

# Purpose: Gather all information about Secret Notes.
# Result is saved to data/secret_notes.json
#
# Content Files used: SecretNotes.json
# Wiki Pages used: https://stardewvalleywiki.com/Secret_Notes

import requests

from tqdm import tqdm
from bs4.element import Tag
from bs4 import BeautifulSoup

from helpers.models import SecretNote
from helpers.utils import load_content, save_json

# Load the content files
SECRET_NOTES: dict[str, str] = load_content("SecretNotes.json")

# make a request to the wiki for extra details
wiki_url = "https://stardewvalleywiki.com/Secret_Notes"
page = requests.get(wiki_url)
soup = BeautifulSoup(page.text, "html.parser")

def get_secret_notes() -> dict[str, SecretNote]:
    output: dict[str, SecretNote] = {}
    
    for k, v in tqdm(SECRET_NOTES.items()):
      if int(k) > 1000: # Journal Scraps for Ginger island
        scrap_id = int(k) - 1000
        name = f"Journal Scrap #{scrap_id}"
        content = v.replace("^", "\n").replace("@", "Player Name")
        content = content.split("%")[0]
        if content.startswith("!image"):
          content = f"[Journal Scrap {scrap_id}](/images/notes/{k}.webp)"
          
        minVersion = "1.5.4"
        
        # TODO: parse soup for extra details/secrets
        
      else:
        name = f"Secret Note #{k}"
        content = v.replace("^", "\n").replace("@", "Player Name")
        content = content.split("%")[0]
        if content.startswith("!image"):
          content = f"[Secret Note {k}](/images/notes/{k}.webp)"
          
        minVersion = "1.6.0" if int(k) > 25 else "1.5.4"
        
        # TODO: parse soup for extra details/secrets
        
      output[k] = {
        "id": int(k),
        "name": name,
        "content": content,
        "minVersion": minVersion,
      }

    return output


if __name__ == "__main__":
    secret_notes = get_secret_notes()

    # as of 1.5, there were 25 secret notes
    # 1.6.0 added 2 new secret notes
    # 11 ginger island journal scraps
    assert len(secret_notes) == 25 + 2 + 11
    save_json(secret_notes, "secret_notes.json")

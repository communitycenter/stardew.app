"""
    I'm lazy and Clem wrote a scraper for achievements, so I'm just tweaking that. 
"""

import json
import requests
import re

from tqdm import tqdm
from bs4 import BeautifulSoup

artifacts = {}
minerals = {}

URL = "https://stardewvalleywiki.com/Artifacts"

page = requests.get(URL)
page2 = requests.get("https://stardewvalleywiki.com/Minerals")

soup = BeautifulSoup(page.text, "html.parser")
soup2 = BeautifulSoup(page2.text, "html.parser")

tbody = soup.find("table").find("tbody")
tbody2 = soup2.find("table").find("tbody")

with open("../../data/objects.json", "r") as file:
    objectsJson = json.load(file)

id = 0
# Loop through all the rows
# For some stupid reason, the first row is the table header
for tr in tqdm(tbody.find_all("tr")[1:]):
    # handle rows that have two rewards like gourmet chef
    # if len(tr.find_all("td")) != 6:
    #     continue

    # Search the first <img> tag in the first <td> tag
    iconURL = tr.find("td").find("img")["src"]

    # Get the text value of the 3rd and 4th <td> tags
    name = tr.find_all("td")[1].text.strip()
    description = tr.find_all("td")[2].text.strip()
    locations = re.sub(
        r"\[\d+\]",
        "",
        tr.find_all("td")[4].text.strip(),
    ).split("\n")
    itemId = 0

    for item_id, item_info in objectsJson.items():
        item_name = item_info.get(
            "name", ""
        ).lower()  # Get the item name (convert to lowercase for case-insensitive match)

        if name.lower() in item_name:
            itemId = item_id

    # Add the achievement to the dictionary
    artifacts[name] = {
        "locations": locations,
        "id": itemId,
    }
    id += 1

htmlobj = [
    """<table class="wikitable sortable roundedborder jquery-tablesorter">
<thead><tr>
<th style="width: 48px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Image
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Name
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Description
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Sell Price
</th>
<th style="width: 70px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Gemologist Sell Price
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Location
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Used in
</th></tr></thead><tbody>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Quartz.png" class="image" data-uno-hassubmittext="no"><img alt="Quartz.png" src="/mediawiki/images/c/cf/Quartz.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Quartz" title="Quartz" data-uno-hassubmittext="no">Quartz</a>
</td>
<td>A clear crystal commonly found in caves and mines.
</td>
<td data-sort-value="25"><span style="display: none;">data-sort-value="25"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">25g</span>
</td>
<td data-sort-value="32"><span style="display: none;">data-sort-value="32"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">32g</span>
</td>
<td><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floors 1-120)<style data-mw-deduplicate="TemplateStyles:r120955">.mw-parser-output .nametemplate{margin:2px 5px 1px 2px;display:block;white-space:nowrap}.mw-parser-output .nametemplateinline{margin:2px 0 1px 2px;display:inline;white-space:nowrap}.mw-parser-output .nametemplate img,.mw-parser-output .nametemplateinline img{max-width:none}</style><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Stone Golem.png" src="/mediawiki/images/thumb/d/d4/Stone_Golem.png/24px-Stone_Golem.png" decoding="async" width="24" height="36" srcset="/mediawiki/images/thumb/d/d4/Stone_Golem.png/36px-Stone_Golem.png 1.5x, /mediawiki/images/thumb/d/d4/Stone_Golem.png/48px-Stone_Golem.png 2x"> <a href="/Stone_Golem" title="Stone Golem" data-uno-hassubmittext="no">Stone Golem</a>&nbsp;(10%)</span>
</td>
<td><p><span style="display:inline; margin-right:0;"><img alt="Bundle Purple.png" src="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/24px-Bundle_Purple.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/36px-Bundle_Purple.png 1.5x, /mediawiki/images/a/a1/Bundle_Purple.png 2x"> <a href="/Bundles#Geologists_Bundle" title="Bundles" data-uno-hassubmittext="no">Geologist's Bundle</a></span></p><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Refined Quartz.png" src="/mediawiki/images/thumb/9/98/Refined_Quartz.png/24px-Refined_Quartz.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/98/Refined_Quartz.png/36px-Refined_Quartz.png 1.5x, /mediawiki/images/9/98/Refined_Quartz.png 2x"> <a href="/Refined_Quartz" title="Refined Quartz" data-uno-hassubmittext="no">Refined Quartz</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Earth_Crystal.png" class="image" data-uno-hassubmittext="no"><img alt="Earth Crystal.png" src="/mediawiki/images/7/74/Earth_Crystal.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Earth_Crystal" title="Earth Crystal" data-uno-hassubmittext="no">Earth Crystal</a>
</td>
<td>A resinous substance found near the surface.
</td>
<td data-sort-value="50"><span style="display: none;">data-sort-value="50"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">50g</span>
</td>
<td data-sort-value="65"><span style="display: none;">data-sort-value="65"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">65g</span>
</td>
<td><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floors 1-39)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Duggy.png" src="/mediawiki/images/thumb/3/3a/Duggy.png/24px-Duggy.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/3/3a/Duggy.png/36px-Duggy.png 1.5x, /mediawiki/images/thumb/3/3a/Duggy.png/48px-Duggy.png 2x"> <a href="/Duggy" title="Duggy" data-uno-hassubmittext="no">Duggy</a>&nbsp;(10%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Haunted Skull.png" src="/mediawiki/images/thumb/1/14/Haunted_Skull.png/24px-Haunted_Skull.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/1/14/Haunted_Skull.png/36px-Haunted_Skull.png 1.5x, /mediawiki/images/thumb/1/14/Haunted_Skull.png/48px-Haunted_Skull.png 2x"> <a href="/Haunted_Skull" title="Haunted Skull" data-uno-hassubmittext="no">Haunted Skull</a>&nbsp;(1.3%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span>
</td>
<td><p><span style="display:inline; margin-right:0;"><img alt="Bundle Purple.png" src="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/24px-Bundle_Purple.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/36px-Bundle_Purple.png 1.5x, /mediawiki/images/a/a1/Bundle_Purple.png 2x"> <a href="/Bundles#Geologists_Bundle" title="Bundles" data-uno-hassubmittext="no">Geologist's Bundle</a></span></p><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Mayonnaise Machine.png" src="/mediawiki/images/thumb/e/ef/Mayonnaise_Machine.png/24px-Mayonnaise_Machine.png" decoding="async" width="24" height="48" srcset="/mediawiki/images/thumb/e/ef/Mayonnaise_Machine.png/36px-Mayonnaise_Machine.png 1.5x, /mediawiki/images/e/ef/Mayonnaise_Machine.png 2x"> <a href="/Mayonnaise_Machine" title="Mayonnaise Machine" data-uno-hassubmittext="no">Mayonnaise Machine</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Frozen_Tear.png" class="image" data-uno-hassubmittext="no"><img alt="Frozen Tear.png" src="/mediawiki/images/e/ec/Frozen_Tear.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Frozen_Tear" title="Frozen Tear" data-uno-hassubmittext="no">Frozen Tear</a>
</td>
<td>A crystal fabled to be the frozen tears of a yeti.
</td>
<td data-sort-value="75"><span style="display: none;">data-sort-value="75"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">75g</span>
</td>
<td data-sort-value="97"><span style="display: none;">data-sort-value="97"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">97g</span>
</td>
<td><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floors 40-79)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Dust Sprite.png" src="/mediawiki/images/thumb/9/9a/Dust_Sprite.png/24px-Dust_Sprite.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9a/Dust_Sprite.png/36px-Dust_Sprite.png 1.5x, /mediawiki/images/thumb/9/9a/Dust_Sprite.png/48px-Dust_Sprite.png 2x"> <a href="/Dust_Sprite" title="Dust Sprite" data-uno-hassubmittext="no">Dust Sprite</a>&nbsp;(2%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span>
</td>
<td><p><span style="display:inline; margin-right:0;"><img alt="Bundle Purple.png" src="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/24px-Bundle_Purple.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/36px-Bundle_Purple.png 1.5x, /mediawiki/images/a/a1/Bundle_Purple.png 2x"> <a href="/Bundles#Geologists_Bundle" title="Bundles" data-uno-hassubmittext="no">Geologist's Bundle</a></span></p><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Warrior Ring.png" src="/mediawiki/images/thumb/1/13/Warrior_Ring.png/24px-Warrior_Ring.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/1/13/Warrior_Ring.png/36px-Warrior_Ring.png 1.5x, /mediawiki/images/1/13/Warrior_Ring.png 2x"> <a href="/Warrior_Ring" title="Warrior Ring" data-uno-hassubmittext="no">Warrior Ring</a></span><span class="no-wrap"><p><img alt="Sebastian Icon.png" src="/mediawiki/images/6/6a/Sebastian_Icon.png" decoding="async" width="32" height="32"> <a href="/Sebastian" title="Sebastian" data-uno-hassubmittext="no">Sebastian</a>&nbsp;(Loved Gift)</p></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Fire_Quartz.png" class="image" data-uno-hassubmittext="no"><img alt="Fire Quartz.png" src="/mediawiki/images/5/5b/Fire_Quartz.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Fire_Quartz" title="Fire Quartz" data-uno-hassubmittext="no">Fire Quartz</a>
</td>
<td>A glowing red crystal commonly found near hot lava.
</td>
<td data-sort-value="100"><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td data-sort-value="130"><span style="display: none;">data-sort-value="130"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">130g</span>
</td>
<td><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floors 80-120)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span>
</td>
<td><p><span style="display:inline; margin-right:0;"><img alt="Bundle Purple.png" src="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/24px-Bundle_Purple.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/a/a1/Bundle_Purple.png/36px-Bundle_Purple.png 1.5x, /mediawiki/images/a/a1/Bundle_Purple.png 2x"> <a href="/Bundles#Geologists_Bundle" title="Bundles" data-uno-hassubmittext="no">Geologist's Bundle</a></span></p><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Slime Egg-Press.png" src="/mediawiki/images/thumb/7/79/Slime_Egg-Press.png/24px-Slime_Egg-Press.png" decoding="async" width="24" height="48" srcset="/mediawiki/images/thumb/7/79/Slime_Egg-Press.png/36px-Slime_Egg-Press.png 1.5x, /mediawiki/images/7/79/Slime_Egg-Press.png 2x"> <a href="/Slime_Egg-Press" title="Slime Egg-Press" data-uno-hassubmittext="no">Slime Egg-Press</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Refined Quartz.png" src="/mediawiki/images/thumb/9/98/Refined_Quartz.png/24px-Refined_Quartz.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/98/Refined_Quartz.png/36px-Refined_Quartz.png 1.5x, /mediawiki/images/9/98/Refined_Quartz.png 2x"> <a href="/Refined_Quartz" title="Refined Quartz" data-uno-hassubmittext="no">Refined Quartz</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr></tbody><tfoot></tfoot></table>""",
    """<table class="wikitable sortable roundedborder jquery-tablesorter">
<thead><tr>
<th style="width: 48px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Image
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Name
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Description
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Sell Price
</th>
<th style="width: 70px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Gemologist Sell Price
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Location
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Used in
</th></tr></thead><tbody>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Emerald.png" class="image" data-uno-hassubmittext="no"><img alt="Emerald.png" src="/mediawiki/images/6/6a/Emerald.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Emerald" title="Emerald" data-uno-hassubmittext="no">Emerald</a>
</td>
<td>A precious stone with a brilliant green color.
</td>
<td data-sort-value="250"><span style="display: none;">data-sort-value="250"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">250g</span>
</td>
<td data-sort-value="325"><span style="display: none;">data-sort-value="325"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">325g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Emerald Node.png" src="/mediawiki/images/thumb/c/c0/Emerald_Node.png/24px-Emerald_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/c/c0/Emerald_Node.png/36px-Emerald_Node.png 1.5x, /mediawiki/images/c/c0/Emerald_Node.png 2x"> <a href="/Mining#Emerald_Node" title="Mining" data-uno-hassubmittext="no">Emerald Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span>
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a>, <a href="/Penny#Gifts" title="Penny" data-uno-hassubmittext="no">Penny</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Aquamarine.png" class="image" data-uno-hassubmittext="no"><img alt="Aquamarine.png" src="/mediawiki/images/a/a2/Aquamarine.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Aquamarine" title="Aquamarine" data-uno-hassubmittext="no">Aquamarine</a>
</td>
<td>A shimmery blue-green gem.
</td>
<td data-sort-value="180"><span style="display: none;">data-sort-value="180"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">180g</span>
</td>
<td data-sort-value="234"><span style="display: none;">data-sort-value="234"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">234g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Aquamarine Node.png" src="/mediawiki/images/thumb/0/0a/Aquamarine_Node.png/24px-Aquamarine_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/0a/Aquamarine_Node.png/36px-Aquamarine_Node.png 1.5x, /mediawiki/images/0/0a/Aquamarine_Node.png 2x"> <a href="/Mining#Aquamarine_Node" title="Mining" data-uno-hassubmittext="no">Aquamarine Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span>
</td>
<td><span style="display:inline; margin-right:0;"><img alt="Bundle Teal.png" src="/mediawiki/images/thumb/c/ce/Bundle_Teal.png/24px-Bundle_Teal.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/c/ce/Bundle_Teal.png/36px-Bundle_Teal.png 1.5x, /mediawiki/images/c/ce/Bundle_Teal.png 2x"> <a href="/Bundles#Dye_Bundle" title="Bundles" data-uno-hassubmittext="no">Dye Bundle</a></span><br><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Marble Brazier.png" src="/mediawiki/images/thumb/e/e0/Marble_Brazier.png/24px-Marble_Brazier.png" decoding="async" width="24" height="38" srcset="/mediawiki/images/thumb/e/e0/Marble_Brazier.png/36px-Marble_Brazier.png 1.5x, /mediawiki/images/e/e0/Marble_Brazier.png 2x"> <a href="/Marble_Brazier" title="Marble Brazier" data-uno-hassubmittext="no">Marble Brazier</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Ruby.png" class="image" data-uno-hassubmittext="no"><img alt="Ruby.png" src="/mediawiki/images/a/a9/Ruby.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Ruby" title="Ruby" data-uno-hassubmittext="no">Ruby</a>
</td>
<td>A precious stone that is sought after for its rich color and beautiful luster.
</td>
<td data-sort-value="250"><span style="display: none;">data-sort-value="250"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">250g</span>
</td>
<td data-sort-value="325"><span style="display: none;">data-sort-value="325"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">325g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Ruby Node.png" src="/mediawiki/images/thumb/e/e8/Ruby_Node.png/24px-Ruby_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/e/e8/Ruby_Node.png/36px-Ruby_Node.png 1.5x, /mediawiki/images/e/e8/Ruby_Node.png 2x"> <a href="/Mining#Ruby_Node" title="Mining" data-uno-hassubmittext="no">Ruby Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span>
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a> (Loved Gift)<br><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Amethyst.png" class="image" data-uno-hassubmittext="no"><img alt="Amethyst.png" src="/mediawiki/images/2/2e/Amethyst.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Amethyst" title="Amethyst" data-uno-hassubmittext="no">Amethyst</a>
</td>
<td>A purple variant of quartz.
</td>
<td data-sort-value="100"><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td data-sort-value="130"><span style="display: none;">data-sort-value="130"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">130g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Amethyst Node.png" src="/mediawiki/images/thumb/8/8f/Amethyst_Node.png/24px-Amethyst_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/8f/Amethyst_Node.png/36px-Amethyst_Node.png 1.5x, /mediawiki/images/8/8f/Amethyst_Node.png 2x"> <a href="/Mining#Amethyst_Node" title="Mining" data-uno-hassubmittext="no">Amethyst Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Green Slime.png" src="/mediawiki/images/thumb/7/7b/Green_Slime.png/24px-Green_Slime.png" decoding="async" width="24" height="25" srcset="/mediawiki/images/thumb/7/7b/Green_Slime.png/36px-Green_Slime.png 1.5x, /mediawiki/images/thumb/7/7b/Green_Slime.png/48px-Green_Slime.png 2x"> <a href="/Slimes" title="Slimes" data-uno-hassubmittext="no">Green Slimes</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span>
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Abigail#Gifts" title="Abigail" data-uno-hassubmittext="no">Abigail</a>, <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Topaz.png" class="image" data-uno-hassubmittext="no"><img alt="Topaz.png" src="/mediawiki/images/a/a5/Topaz.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Topaz" title="Topaz" data-uno-hassubmittext="no">Topaz</a>
</td>
<td>Fairly common but still prized for its beauty.
</td>
<td data-sort-value="80"><span style="display: none;">data-sort-value="80"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">80g</span>
</td>
<td data-sort-value="104"><span style="display: none;">data-sort-value="104"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">104g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Topaz Node.png" src="/mediawiki/images/thumb/3/3f/Topaz_Node.png/24px-Topaz_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/3/3f/Topaz_Node.png/36px-Topaz_Node.png 1.5x, /mediawiki/images/3/3f/Topaz_Node.png 2x"> <a href="/Mining#Topaz_Node" title="Mining" data-uno-hassubmittext="no">Topaz Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span>
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Jade.png" class="image" data-uno-hassubmittext="no"><img alt="Jade.png" src="/mediawiki/images/7/7e/Jade.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Jade" title="Jade" data-uno-hassubmittext="no">Jade</a>
</td>
<td>A pale green ornamental stone.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Jade Node.png" src="/mediawiki/images/thumb/9/97/Jade_Node.png/24px-Jade_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/97/Jade_Node.png/36px-Jade_Node.png 1.5x, /mediawiki/images/9/97/Jade_Node.png 2x"> <a href="/Mining#Jade_Node" title="Mining" data-uno-hassubmittext="no">Jade Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frost Jelly.png" src="/mediawiki/images/thumb/9/9d/Frost_Jelly.png/24px-Frost_Jelly.png" decoding="async" width="24" height="25" srcset="/mediawiki/images/thumb/9/9d/Frost_Jelly.png/36px-Frost_Jelly.png 1.5x, /mediawiki/images/thumb/9/9d/Frost_Jelly.png/48px-Frost_Jelly.png 2x"> <a href="/Slimes" title="Slimes" data-uno-hassubmittext="no">Blue Slimes</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span>
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>, <a href="/Emily#Gifts" title="Emily" data-uno-hassubmittext="no">Emily</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Diamond.png" class="image" data-uno-hassubmittext="no"><img alt="Diamond.png" src="/mediawiki/images/e/ea/Diamond.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Diamond" title="Diamond" data-uno-hassubmittext="no">Diamond</a>
</td>
<td>A rare and valuable gem.
</td>
<td data-sort-value="750"><span style="display: none;">data-sort-value="750"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">750g</span>
</td>
<td data-sort-value="975"><span style="display: none;">data-sort-value="975"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">975g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Diamond Node.png" src="/mediawiki/images/thumb/0/0e/Diamond_Node.png/24px-Diamond_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/0e/Diamond_Node.png/36px-Diamond_Node.png 1.5x, /mediawiki/images/0/0e/Diamond_Node.png 2x"> <a href="/Mining#Diamond_Node" title="Mining" data-uno-hassubmittext="no">Diamond Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Gem Node.png" src="/mediawiki/images/thumb/9/9e/Gem_Node.png/24px-Gem_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/9/9e/Gem_Node.png/36px-Gem_Node.png 1.5x, /mediawiki/images/9/9e/Gem_Node.png 2x"> <a href="/Mining#Gem_Node" title="Mining" data-uno-hassubmittext="no">Gem Node</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Garbage Can.png" src="/mediawiki/images/thumb/7/79/Garbage_Can.png/24px-Garbage_Can.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/79/Garbage_Can.png/36px-Garbage_Can.png 1.5x, /mediawiki/images/thumb/7/79/Garbage_Can.png/48px-Garbage_Can.png 2x"> <a href="/Garbage_Can" title="Garbage Can" data-uno-hassubmittext="no">Garbage Can</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span>Any <a href="/Monsters" title="Monsters" data-uno-hassubmittext="no">monster</a> after reaching the bottom of <a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">the mines</a> (0.05%)
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Ring of Yoba.png" src="/mediawiki/images/thumb/2/21/Ring_of_Yoba.png/24px-Ring_of_Yoba.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/2/21/Ring_of_Yoba.png/36px-Ring_of_Yoba.png 1.5x, /mediawiki/images/2/21/Ring_of_Yoba.png 2x"> <a href="/Ring_of_Yoba" title="Ring of Yoba" data-uno-hassubmittext="no">Ring of Yoba</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode Crusher.png" src="/mediawiki/images/thumb/0/02/Geode_Crusher.png/24px-Geode_Crusher.png" decoding="async" width="24" height="48" srcset="/mediawiki/images/thumb/0/02/Geode_Crusher.png/36px-Geode_Crusher.png 1.5x, /mediawiki/images/0/02/Geode_Crusher.png 2x"> <a href="/Geode_Crusher" title="Geode Crusher" data-uno-hassubmittext="no">Geode Crusher</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fairy Dust.png" src="/mediawiki/images/thumb/f/fc/Fairy_Dust.png/24px-Fairy_Dust.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/f/fc/Fairy_Dust.png/36px-Fairy_Dust.png 1.5x, /mediawiki/images/f/fc/Fairy_Dust.png 2x"> <a href="/Fairy_Dust" title="Fairy Dust" data-uno-hassubmittext="no">Fairy Dust</a></span><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Evelyn#Gifts" title="Evelyn" data-uno-hassubmittext="no">Evelyn</a>, <a href="/Gus#Gifts" title="Gus" data-uno-hassubmittext="no">Gus</a>, <a href="/Jodi#Gifts" title="Jodi" data-uno-hassubmittext="no">Jodi</a>, <a href="/Krobus#Gifts" title="Krobus" data-uno-hassubmittext="no">Krobus</a>, <a href="/Marnie#Gifts" title="Marnie" data-uno-hassubmittext="no">Marnie</a>, <a href="/Maru#Gifts" title="Maru" data-uno-hassubmittext="no">Maru</a>, <a href="/Penny#Gifts" title="Penny" data-uno-hassubmittext="no">Penny</a>, <a href="/Willy#Gifts" title="Willy" data-uno-hassubmittext="no">Willy</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span><a href="/Forge#Weapon_forging" title="Forge" data-uno-hassubmittext="no">Forge</a> weapons
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Prismatic_Shard.png" class="image" data-uno-hassubmittext="no"><img alt="Prismatic Shard.png" src="/mediawiki/images/5/56/Prismatic_Shard.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Prismatic_Shard" title="Prismatic Shard" data-uno-hassubmittext="no">Prismatic Shard</a>
</td>
<td>A very rare and powerful substance with unknown origins.
</td>
<td data-sort-value="2000"><span style="display: none;">data-sort-value="2000"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">2,000g</span>
</td>
<td data-sort-value="2600"><span style="display: none;">data-sort-value="2600"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">2,600g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Iridium Node.png" src="/mediawiki/images/thumb/4/4d/Iridium_Node.png/24px-Iridium_Node.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/4d/Iridium_Node.png/36px-Iridium_Node.png 1.5x, /mediawiki/images/4/4d/Iridium_Node.png 2x"> <a href="/Mining#Iridium_Node" title="Mining" data-uno-hassubmittext="no">Iridium Node</a>&nbsp;(4%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Mystic Stone.png" src="/mediawiki/images/thumb/4/4b/Mystic_Stone.png/24px-Mystic_Stone.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/4b/Mystic_Stone.png/36px-Mystic_Stone.png 1.5x, /mediawiki/images/4/4b/Mystic_Stone.png 2x"> <a href="/Mining#Mystic_Stone" title="Mining" data-uno-hassubmittext="no">Mystic Stone</a>&nbsp;(25%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a>&nbsp;(0<b>.</b>4%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Shadow Brute.png" src="/mediawiki/images/thumb/e/e0/Shadow_Brute.png/24px-Shadow_Brute.png" decoding="async" width="24" height="44" srcset="/mediawiki/images/thumb/e/e0/Shadow_Brute.png/36px-Shadow_Brute.png 1.5x, /mediawiki/images/thumb/e/e0/Shadow_Brute.png/48px-Shadow_Brute.png 2x"> <a href="/Shadow_Brute" title="Shadow Brute" data-uno-hassubmittext="no">Shadow Brute</a>&nbsp;(0<b>.</b>05%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Shadow Shaman.png" src="/mediawiki/images/thumb/1/11/Shadow_Shaman.png/24px-Shadow_Shaman.png" decoding="async" width="24" height="41" srcset="/mediawiki/images/thumb/1/11/Shadow_Shaman.png/36px-Shadow_Shaman.png 1.5x, /mediawiki/images/thumb/1/11/Shadow_Shaman.png/48px-Shadow_Shaman.png 2x"> <a href="/Shadow_Shaman" title="Shadow Shaman" data-uno-hassubmittext="no">Shadow Shaman</a>&nbsp;(0<b>.</b>05%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Mummy.png" src="/mediawiki/images/thumb/7/70/Mummy.png/24px-Mummy.png" decoding="async" width="24" height="45" srcset="/mediawiki/images/thumb/7/70/Mummy.png/36px-Mummy.png 1.5x, /mediawiki/images/thumb/7/70/Mummy.png/48px-Mummy.png 2x"> <a href="/Mummy" title="Mummy" data-uno-hassubmittext="no">Mummy</a>&nbsp;(0<b>.</b>1%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Serpent.png" src="/mediawiki/images/thumb/8/89/Serpent.png/24px-Serpent.png" decoding="async" width="24" height="26" srcset="/mediawiki/images/thumb/8/89/Serpent.png/36px-Serpent.png 1.5x, /mediawiki/images/thumb/8/89/Serpent.png/48px-Serpent.png 2x"> <a href="/Serpent" title="Serpent" data-uno-hassubmittext="no">Serpent</a>&nbsp;(0<b>.</b>1%)</span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span>Any <a href="/Monsters" title="Monsters" data-uno-hassubmittext="no">monster</a> after reaching the bottom of <a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">the mines</a> (0.05%)
</td>
<td><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> Loved by all <a href="/Villagers" title="Villagers" data-uno-hassubmittext="no">Villagers</a> except <a href="/Haley" title="Haley" data-uno-hassubmittext="no">Haley</a>, who hates it.
<p>Obtain the <a href="/Weapons#Swords" title="Weapons" data-uno-hassubmittext="no">Galaxy Sword</a> in <a href="/The_Desert" title="The Desert" data-uno-hassubmittext="no">the Desert</a>
</p><p>Transform children into doves at the <a href="/Witch%27s_Hut" title="Witch's Hut" data-uno-hassubmittext="no">Dark Shrine of Selfishness</a>
</p><p><a href="/Forge#Enchantments" title="Forge" data-uno-hassubmittext="no">Enchant</a> tools and weapons
</p>
</td></tr></tbody><tfoot></tfoot></table>""",
    """<table class="wikitable sortable roundedborder jquery-tablesorter">
<thead><tr>
<th style="width: 48px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Image
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Name
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Description
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Sell Price
</th>
<th style="width: 70px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Gemologist Sell Price
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Location
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Used in
</th></tr></thead><tbody>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Tigerseye.png" class="image" data-uno-hassubmittext="no"><img alt="Tigerseye.png" src="/mediawiki/images/6/6e/Tigerseye.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Tigerseye" title="Tigerseye" data-uno-hassubmittext="no">Tigerseye</a>
</td>
<td>A stripe of shimmering gold gives this gem a warm luster.
</td>
<td data-sort-value="275"><span style="display: none;">data-sort-value="275"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">275g</span>
</td>
<td data-sort-value="357"><span style="display: none;">data-sort-value="357"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">357g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><p><img alt="Sam Icon.png" src="/mediawiki/images/5/52/Sam_Icon.png" decoding="async" width="32" height="32"> <a href="/Sam" title="Sam" data-uno-hassubmittext="no">Sam</a>&nbsp;(Loved Gift)</p>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Opal.png" class="image" data-uno-hassubmittext="no"><img alt="Opal.png" src="/mediawiki/images/3/3c/Opal.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Opal" title="Opal" data-uno-hassubmittext="no">Opal</a>
</td>
<td>Its internal structure causes it to reflect a rainbow of light.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Fire_Opal.png" class="image" data-uno-hassubmittext="no"><img alt="Fire Opal.png" src="/mediawiki/images/6/60/Fire_Opal.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Fire_Opal" title="Fire Opal" data-uno-hassubmittext="no">Fire Opal</a>
</td>
<td>A rare variety of opal, named for its red spots.
</td>
<td data-sort-value="350"><span style="display: none;">data-sort-value="350"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">350g</span>
</td>
<td data-sort-value="455"><span style="display: none;">data-sort-value="455"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">455g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Alamite.png" class="image" data-uno-hassubmittext="no"><img alt="Alamite.png" src="/mediawiki/images/7/7c/Alamite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Alamite" title="Alamite" data-uno-hassubmittext="no">Alamite</a>
</td>
<td>Its distinctive fluorescence makes it a favorite among rock collectors.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Bixite.png" class="image" data-uno-hassubmittext="no"><img alt="Bixite.png" src="/mediawiki/images/9/98/Bixite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Bixite" title="Bixite" data-uno-hassubmittext="no">Bixite</a>
</td>
<td>A dark metallic Mineral sought after for its cubic structure.
</td>
<td data-sort-value="300"><span style="display: none;">data-sort-value="300"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">300g</span>
</td>
<td data-sort-value="390"><span style="display: none;">data-sort-value="390"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">390g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Black Slime.png" src="/mediawiki/images/thumb/5/5c/Black_Slime.png/24px-Black_Slime.png" decoding="async" width="24" height="25" srcset="/mediawiki/images/thumb/5/5c/Black_Slime.png/36px-Black_Slime.png 1.5x, /mediawiki/images/thumb/5/5c/Black_Slime.png/48px-Black_Slime.png 2x"> <a href="/Slimes" title="Slimes" data-uno-hassubmittext="no">Black Slime</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Baryte.png" class="image" data-uno-hassubmittext="no"><img alt="Baryte.png" src="/mediawiki/images/a/aa/Baryte.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Baryte" title="Baryte" data-uno-hassubmittext="no">Baryte</a>
</td>
<td>The best specimens resemble a desert rose.
</td>
<td data-sort-value="50"><span style="display: none;">data-sort-value="50"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">50g</span>
</td>
<td data-sort-value="65"><span style="display: none;">data-sort-value="65"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">65g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Aerinite.png" class="image" data-uno-hassubmittext="no"><img alt="Aerinite.png" src="/mediawiki/images/6/6b/Aerinite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Aerinite" title="Aerinite" data-uno-hassubmittext="no">Aerinite</a>
</td>
<td>These crystals are curiously light.
</td>
<td data-sort-value="125"><span style="display: none;">data-sort-value="125"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">125g</span>
</td>
<td data-sort-value="162"><span style="display: none;">data-sort-value="162"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">162g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Calcite.png" class="image" data-uno-hassubmittext="no"><img alt="Calcite.png" src="/mediawiki/images/9/97/Calcite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Calcite" title="Calcite" data-uno-hassubmittext="no">Calcite</a>
</td>
<td>This yellow crystal is speckled with shimmering nodules.
</td>
<td data-sort-value="75"><span style="display: none;">data-sort-value="75"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">75g</span>
</td>
<td data-sort-value="97"><span style="display: none;">data-sort-value="97"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">97g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Dolomite.png" class="image" data-uno-hassubmittext="no"><img alt="Dolomite.png" src="/mediawiki/images/d/d4/Dolomite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Dolomite" title="Dolomite" data-uno-hassubmittext="no">Dolomite</a>
</td>
<td>It can occur in coral reefs, often near an underwater volcano.
</td>
<td data-sort-value="300"><span style="display: none;">data-sort-value="300"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">300g</span>
</td>
<td data-sort-value="390"><span style="display: none;">data-sort-value="390"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">390g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Esperite.png" class="image" data-uno-hassubmittext="no"><img alt="Esperite.png" src="/mediawiki/images/a/aa/Esperite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Esperite" title="Esperite" data-uno-hassubmittext="no">Esperite</a>
</td>
<td>The crystals glow bright green when stimulated.
</td>
<td data-sort-value="100"><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td data-sort-value="130"><span style="display: none;">data-sort-value="130"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">130g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Fluorapatite.png" class="image" data-uno-hassubmittext="no"><img alt="Fluorapatite.png" src="/mediawiki/images/4/4a/Fluorapatite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Fluorapatite" title="Fluorapatite" data-uno-hassubmittext="no">Fluorapatite</a>
</td>
<td>Small amounts are found in human teeth.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Geminite.png" class="image" data-uno-hassubmittext="no"><img alt="Geminite.png" src="/mediawiki/images/5/54/Geminite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Geminite" title="Geminite" data-uno-hassubmittext="no">Geminite</a>
</td>
<td>Occurs in brilliant clusters.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Helvite.png" class="image" data-uno-hassubmittext="no"><img alt="Helvite.png" src="/mediawiki/images/3/3f/Helvite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Helvite" title="Helvite" data-uno-hassubmittext="no">Helvite</a>
</td>
<td>It grows in a triangular column.
</td>
<td data-sort-value="450"><span style="display: none;">data-sort-value="450"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">450g</span>
</td>
<td data-sort-value="585"><span style="display: none;">data-sort-value="585"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">585g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Jamborite.png" class="image" data-uno-hassubmittext="no"><img alt="Jamborite.png" src="/mediawiki/images/4/4b/Jamborite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Jamborite" title="Jamborite" data-uno-hassubmittext="no">Jamborite</a>
</td>
<td>The crystals are so tightly packed it almost looks fuzzy.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Jagoite.png" class="image" data-uno-hassubmittext="no"><img alt="Jagoite.png" src="/mediawiki/images/c/c3/Jagoite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Jagoite" title="Jagoite" data-uno-hassubmittext="no">Jagoite</a>
</td>
<td>A high volume of tiny crystals makes it very glittery.
</td>
<td data-sort-value="115"><span style="display: none;">data-sort-value="115"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">115g</span>
</td>
<td data-sort-value="149"><span style="display: none;">data-sort-value="149"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">149g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Kyanite.png" class="image" data-uno-hassubmittext="no"><img alt="Kyanite.png" src="/mediawiki/images/e/e4/Kyanite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Kyanite" title="Kyanite" data-uno-hassubmittext="no">Kyanite</a>
</td>
<td>The geometric faces are as smooth as glass.
</td>
<td data-sort-value="250"><span style="display: none;">data-sort-value="250"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">250g</span>
</td>
<td data-sort-value="325"><span style="display: none;">data-sort-value="325"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">325g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Lunarite.png" class="image" data-uno-hassubmittext="no"><img alt="Lunarite.png" src="/mediawiki/images/0/06/Lunarite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Lunarite" title="Lunarite" data-uno-hassubmittext="no">Lunarite</a>
</td>
<td>The cratered white orbs form a tight cluster.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Malachite.png" class="image" data-uno-hassubmittext="no"><img alt="Malachite.png" src="/mediawiki/images/a/ad/Malachite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Malachite" title="Malachite" data-uno-hassubmittext="no">Malachite</a>
</td>
<td>A popular ornamental stone, used in sculpture and to make green paint.
</td>
<td data-sort-value="100"><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td data-sort-value="130"><span style="display: none;">data-sort-value="130"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">130g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Neptunite.png" class="image" data-uno-hassubmittext="no"><img alt="Neptunite.png" src="/mediawiki/images/0/05/Neptunite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Neptunite" title="Neptunite" data-uno-hassubmittext="no">Neptunite</a>
</td>
<td>A jet-black crystal that is unusually reflective.
</td>
<td data-sort-value="400"><span style="display: none;">data-sort-value="400"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">400g</span>
</td>
<td data-sort-value="520"><span style="display: none;">data-sort-value="520"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">520g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Black Slime.png" src="/mediawiki/images/thumb/5/5c/Black_Slime.png/24px-Black_Slime.png" decoding="async" width="24" height="25" srcset="/mediawiki/images/thumb/5/5c/Black_Slime.png/36px-Black_Slime.png 1.5x, /mediawiki/images/thumb/5/5c/Black_Slime.png/48px-Black_Slime.png 2x"> <a href="/Slimes" title="Slimes" data-uno-hassubmittext="no">Black Slime</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Lemon_Stone.png" class="image" data-uno-hassubmittext="no"><img alt="Lemon Stone.png" src="/mediawiki/images/3/31/Lemon_Stone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Lemon_Stone" title="Lemon Stone" data-uno-hassubmittext="no">Lemon Stone</a>
</td>
<td>Some claim the powdered crystal is a dwarvish delicacy.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><p><img alt="Dwarf Icon.png" src="/mediawiki/images/0/08/Dwarf_Icon.png" decoding="async" width="32" height="32"> <a href="/Dwarf" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a>&nbsp;(Loved Gift)</p>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Nekoite.png" class="image" data-uno-hassubmittext="no"><img alt="Nekoite.png" src="/mediawiki/images/5/53/Nekoite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Nekoite" title="Nekoite" data-uno-hassubmittext="no">Nekoite</a>
</td>
<td>The delicate shards form a tiny pink meadow.
</td>
<td data-sort-value="80"><span style="display: none;">data-sort-value="80"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">80g</span>
</td>
<td data-sort-value="104"><span style="display: none;">data-sort-value="104"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">104g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Orpiment.png" class="image" data-uno-hassubmittext="no"><img alt="Orpiment.png" src="/mediawiki/images/4/41/Orpiment.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Orpiment" title="Orpiment" data-uno-hassubmittext="no">Orpiment</a>
</td>
<td>Despite its high toxicity, this Mineral is widely used in manufacturing and folk medicine.
</td>
<td data-sort-value="80"><span style="display: none;">data-sort-value="80"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">80g</span>
</td>
<td data-sort-value="104"><span style="display: none;">data-sort-value="104"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">104g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Petrified_Slime.png" class="image" data-uno-hassubmittext="no"><img alt="Petrified Slime.png" src="/mediawiki/images/2/24/Petrified_Slime.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Petrified_Slime" title="Petrified Slime" data-uno-hassubmittext="no">Petrified Slime</a>
</td>
<td>This little guy may be 100,000 years old.
</td>
<td data-sort-value="120"><span style="display: none;">data-sort-value="120"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">120g</span>
</td>
<td data-sort-value="156"><span style="display: none;">data-sort-value="156"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">156g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Slime Ball.png" src="/mediawiki/images/thumb/0/06/Slime_Ball.png/24px-Slime_Ball.png" decoding="async" width="24" height="42" srcset="/mediawiki/images/thumb/0/06/Slime_Ball.png/36px-Slime_Ball.png 1.5x, /mediawiki/images/thumb/0/06/Slime_Ball.png/48px-Slime_Ball.png 2x"> <a href="/Slime_Ball" title="Slime Ball" data-uno-hassubmittext="no">Slime Ball</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Thunder_Egg.png" class="image" data-uno-hassubmittext="no"><img alt="Thunder Egg.png" src="/mediawiki/images/1/14/Thunder_Egg.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Thunder_Egg" title="Thunder Egg" data-uno-hassubmittext="no">Thunder Egg</a>
</td>
<td>According to legend, angry thunder spirits would throw these stones at one another.
</td>
<td data-sort-value="100"><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td data-sort-value="130"><span style="display: none;">data-sort-value="130"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">130g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Pyrite.png" class="image" data-uno-hassubmittext="no"><img alt="Pyrite.png" src="/mediawiki/images/6/64/Pyrite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Pyrite" title="Pyrite" data-uno-hassubmittext="no">Pyrite</a>
</td>
<td>Commonly known as "Fool's Gold".
</td>
<td data-sort-value="120"><span style="display: none;">data-sort-value="120"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">120g</span>
</td>
<td data-sort-value="156"><span style="display: none;">data-sort-value="156"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">156g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Ocean_Stone.png" class="image" data-uno-hassubmittext="no"><img alt="Ocean Stone.png" src="/mediawiki/images/f/f1/Ocean_Stone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Ocean_Stone" title="Ocean Stone" data-uno-hassubmittext="no">Ocean Stone</a>
</td>
<td>An old legend claims these stones are the mosaics of ancient mermaids.
</td>
<td data-sort-value="220"><span style="display: none;">data-sort-value="220"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">220g</span>
</td>
<td data-sort-value="286"><span style="display: none;">data-sort-value="286"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">286g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Ghost_Crystal.png" class="image" data-uno-hassubmittext="no"><img alt="Ghost Crystal.png" src="/mediawiki/images/d/d0/Ghost_Crystal.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Ghost_Crystal" title="Ghost Crystal" data-uno-hassubmittext="no">Ghost Crystal</a>
</td>
<td>There is an aura of coldness around this crystal.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Jasper.png" class="image" data-uno-hassubmittext="no"><img alt="Jasper.png" src="/mediawiki/images/9/9b/Jasper.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Jasper" title="Jasper" data-uno-hassubmittext="no">Jasper</a>
</td>
<td>When polished, this stone becomes attractively luminous. Prized by ancient peoples for thousands of years.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Celestine.png" class="image" data-uno-hassubmittext="no"><img alt="Celestine.png" src="/mediawiki/images/1/19/Celestine.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Celestine" title="Celestine" data-uno-hassubmittext="no">Celestine</a>
</td>
<td>Some early life forms had bones made from this.
</td>
<td data-sort-value="125"><span style="display: none;">data-sort-value="125"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">125g</span>
</td>
<td data-sort-value="162"><span style="display: none;">data-sort-value="162"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">162g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Marble.png" class="image" data-uno-hassubmittext="no"><img alt="Marble.png" src="/mediawiki/images/8/82/Marble.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Marble" title="Marble" data-uno-hassubmittext="no">Marble</a>
</td>
<td>A very popular material for sculptures and construction.
</td>
<td data-sort-value="110"><span style="display: none;">data-sort-value="110"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">110g</span>
</td>
<td data-sort-value="143"><span style="display: none;">data-sort-value="143"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">143g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Marble Brazier.png" src="/mediawiki/images/thumb/e/e0/Marble_Brazier.png/24px-Marble_Brazier.png" decoding="async" width="24" height="38" srcset="/mediawiki/images/thumb/e/e0/Marble_Brazier.png/36px-Marble_Brazier.png 1.5x, /mediawiki/images/e/e0/Marble_Brazier.png 2x"> <a href="/Marble_Brazier" title="Marble Brazier" data-uno-hassubmittext="no">Marble Brazier</a></span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Sandstone.png" class="image" data-uno-hassubmittext="no"><img alt="Sandstone.png" src="/mediawiki/images/d/d6/Sandstone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Sandstone" title="Sandstone" data-uno-hassubmittext="no">Sandstone</a>
</td>
<td>A common type of stone with red and brown striations.
</td>
<td data-sort-value="60"><span style="display: none;">data-sort-value="60"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">60g</span>
</td>
<td data-sort-value="78"><span style="display: none;">data-sort-value="78"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">78g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Granite.png" class="image" data-uno-hassubmittext="no"><img alt="Granite.png" src="/mediawiki/images/4/4a/Granite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Granite" title="Granite" data-uno-hassubmittext="no">Granite</a>
</td>
<td>A speckled Mineral that is commonly used in construction.
</td>
<td data-sort-value="75"><span style="display: none;">data-sort-value="75"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">75g</span>
</td>
<td data-sort-value="97"><span style="display: none;">data-sort-value="97"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">97g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Basalt.png" class="image" data-uno-hassubmittext="no"><img alt="Basalt.png" src="/mediawiki/images/2/22/Basalt.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Basalt" title="Basalt" data-uno-hassubmittext="no">Basalt</a>
</td>
<td>Forms near searing hot magma.
</td>
<td data-sort-value="175"><span style="display: none;">data-sort-value="175"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">175g</span>
</td>
<td data-sort-value="227"><span style="display: none;">data-sort-value="227"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">227g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Limestone.png" class="image" data-uno-hassubmittext="no"><img alt="Limestone.png" src="/mediawiki/images/4/4e/Limestone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Limestone" title="Limestone" data-uno-hassubmittext="no">Limestone</a>
</td>
<td>A very common type of stone. It's not worth very much.
</td>
<td data-sort-value="15"><span style="display: none;">data-sort-value="15"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">15g</span>
</td>
<td data-sort-value="19"><span style="display: none;">data-sort-value="19"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">19g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Soapstone.png" class="image" data-uno-hassubmittext="no"><img alt="Soapstone.png" src="/mediawiki/images/8/81/Soapstone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Soapstone" title="Soapstone" data-uno-hassubmittext="no">Soapstone</a>
</td>
<td>Because of its relatively soft consistency, this stone is very popular for carving.
</td>
<td data-sort-value="120"><span style="display: none;">data-sort-value="120"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">120g</span>
</td>
<td data-sort-value="156"><span style="display: none;">data-sort-value="156"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">156g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Hematite.png" class="image" data-uno-hassubmittext="no"><img alt="Hematite.png" src="/mediawiki/images/b/b1/Hematite.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Hematite" title="Hematite" data-uno-hassubmittext="no">Hematite</a>
</td>
<td>An iron-based Mineral with interesting magnetic properties.
</td>
<td data-sort-value="150"><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td data-sort-value="195"><span style="display: none;">data-sort-value="195"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">195g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Mudstone.png" class="image" data-uno-hassubmittext="no"><img alt="Mudstone.png" src="/mediawiki/images/5/52/Mudstone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Mudstone" title="Mudstone" data-uno-hassubmittext="no">Mudstone</a>
</td>
<td>A fine-grained rock made from ancient clay or mud.
</td>
<td data-sort-value="25"><span style="display: none;">data-sort-value="25"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">25g</span>
</td>
<td data-sort-value="32"><span style="display: none;">data-sort-value="32"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">32g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Obsidian.png" class="image" data-uno-hassubmittext="no"><img alt="Obsidian.png" src="/mediawiki/images/2/23/Obsidian.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Obsidian" title="Obsidian" data-uno-hassubmittext="no">Obsidian</a>
</td>
<td>A volcanic glass that forms when lava cools rapidly.
</td>
<td data-sort-value="200"><span style="display: none;">data-sort-value="200"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">200g</span>
</td>
<td data-sort-value="260"><span style="display: none;">data-sort-value="260"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">260g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td class="no-wrap"><p><img alt="Sebastian Icon.png" src="/mediawiki/images/6/6a/Sebastian_Icon.png" decoding="async" width="32" height="32"> <a href="/Sebastian" title="Sebastian" data-uno-hassubmittext="no">Sebastian</a>&nbsp;(Loved Gift)</p>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Slate.png" class="image" data-uno-hassubmittext="no"><img alt="Slate.png" src="/mediawiki/images/9/97/Slate.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Slate" title="Slate" data-uno-hassubmittext="no">Slate</a>
</td>
<td>It's extremely resistant to water, making it a good roofing material.
</td>
<td data-sort-value="85"><span style="display: none;">data-sort-value="85"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">85g</span>
</td>
<td data-sort-value="110"><span style="display: none;">data-sort-value="110"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">110g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Geode.png" src="/mediawiki/images/thumb/4/43/Geode.png/24px-Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/4/43/Geode.png/36px-Geode.png 1.5x, /mediawiki/images/4/43/Geode.png 2x"> <a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Fairy_Stone.png" class="image" data-uno-hassubmittext="no"><img alt="Fairy Stone.png" src="/mediawiki/images/d/d9/Fairy_Stone.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Fairy_Stone" title="Fairy Stone" data-uno-hassubmittext="no">Fairy Stone</a>
</td>
<td>An old miner's song suggests these are made from the bones of ancient fairies.
</td>
<td data-sort-value="250"><span style="display: none;">data-sort-value="250"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">250g</span>
</td>
<td data-sort-value="325"><span style="display: none;">data-sort-value="325"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">325g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Frozen Geode.png" src="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/24px-Frozen_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bf/Frozen_Geode.png/36px-Frozen_Geode.png 1.5x, /mediawiki/images/b/bf/Frozen_Geode.png 2x"> <a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Star_Shards.png" class="image" data-uno-hassubmittext="no"><img alt="Star Shards.png" src="/mediawiki/images/3/3f/Star_Shards.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Star_Shards" title="Star Shards" data-uno-hassubmittext="no">Star Shards</a>
</td>
<td>No one knows how these form. Some scientists claim that the microscopic structure displays unnatural regularity.
</td>
<td data-sort-value="500"><span style="display: none;">data-sort-value="500"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">500g</span>
</td>
<td data-sort-value="650"><span style="display: none;">data-sort-value="650"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">650g</span>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Magma Geode.png" src="/mediawiki/images/thumb/8/89/Magma_Geode.png/24px-Magma_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/89/Magma_Geode.png/36px-Magma_Geode.png 1.5x, /mediawiki/images/8/89/Magma_Geode.png 2x"> <a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Omni Geode.png" src="/mediawiki/images/thumb/0/09/Omni_Geode.png/24px-Omni_Geode.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/0/09/Omni_Geode.png/36px-Omni_Geode.png 1.5x, /mediawiki/images/0/09/Omni_Geode.png 2x"> <a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a></span>
</td>
<td>
</td></tr></tbody><tfoot></tfoot></table>""",
    """<table class="wikitable sortable roundedborder jquery-tablesorter">
<thead><tr>
<th style="width: 48px;" class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Image
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Name
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Description
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Sell Price
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Location
</th>
<th class="headerSort" tabindex="0" role="columnheader button" title="Sort ascending">Used in
</th></tr></thead><tbody>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Geode.png" class="image" data-uno-hassubmittext="no"><img alt="Geode.png" src="/mediawiki/images/4/43/Geode.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Geode" title="Geode" data-uno-hassubmittext="no">Geode</a>
</td>
<td>A blacksmith can break this open for you.
</td>
<td><span style="display: none;">data-sort-value="50"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">50g</span>
</td>
<td><ul><li><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floors 1-39)</li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplateinline"><img alt="Duggy.png" src="/mediawiki/images/thumb/3/3a/Duggy.png/24px-Duggy.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/3/3a/Duggy.png/36px-Duggy.png 1.5x, /mediawiki/images/thumb/3/3a/Duggy.png/48px-Duggy.png 2x"> <a href="/Duggy" title="Duggy" data-uno-hassubmittext="no">Duggy</a>&nbsp;(25%)</span></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplateinline"><img alt="Hoe.png" src="/mediawiki/images/thumb/8/87/Hoe.png/24px-Hoe.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/87/Hoe.png/36px-Hoe.png 1.5x, /mediawiki/images/8/87/Hoe.png 2x"> <a href="/Hoes" title="Hoes" data-uno-hassubmittext="no">Tilling</a></span> on <a href="/The_Farm" title="The Farm" data-uno-hassubmittext="no">The Farm</a></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span></li></ul>
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Frozen_Geode.png" class="image" data-uno-hassubmittext="no"><img alt="Frozen Geode.png" src="/mediawiki/images/b/bf/Frozen_Geode.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Frozen_Geode" title="Frozen Geode" data-uno-hassubmittext="no">Frozen Geode</a>
</td>
<td>A blacksmith can break this open for you.
</td>
<td><span style="display: none;">data-sort-value="100"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">100g</span>
</td>
<td><ul><li><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floor 41-79)</li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span></li><li class="no-wrap"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplateinline"><img alt="Hoe.png" src="/mediawiki/images/thumb/8/87/Hoe.png/24px-Hoe.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/87/Hoe.png/36px-Hoe.png 1.5x, /mediawiki/images/8/87/Hoe.png 2x"> <a href="/Hoes" title="Hoes" data-uno-hassubmittext="no">Tilling</a></span> on <a href="/The_Farm" title="The Farm" data-uno-hassubmittext="no">The Farm</a> (<a href="/Winter" title="Winter" data-uno-hassubmittext="no">Winter</a>)</li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span></li></ul>
</td>
<td><span style="display:inline; margin-right:0;"><img alt="Bundle Blue.png" src="/mediawiki/images/thumb/e/e4/Bundle_Blue.png/24px-Bundle_Blue.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/e/e4/Bundle_Blue.png/36px-Bundle_Blue.png 1.5x, /mediawiki/images/e/e4/Bundle_Blue.png 2x"> <a href="/Bundles#Field_Research_Bundle" title="Bundles" data-uno-hassubmittext="no">Field Research Bundle</a></span><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Magma_Geode.png" class="image" data-uno-hassubmittext="no"><img alt="Magma Geode.png" src="/mediawiki/images/8/89/Magma_Geode.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Magma_Geode" title="Magma Geode" data-uno-hassubmittext="no">Magma Geode</a>
</td>
<td>A blacksmith can break this open for you.
</td>
<td><span style="display: none;">data-sort-value="150"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">150g</span>
</td>
<td><ul><li><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a> (Floor 81-120)</li><li>Boxes/barrels in the <a href="/Skull_Cavern" title="Skull Cavern" data-uno-hassubmittext="no">Skull Cavern</a></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fishing Treasure Chest.png" src="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/24px-Fishing_Treasure_Chest.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/b/bb/Fishing_Treasure_Chest.png/36px-Fishing_Treasure_Chest.png 1.5x, /mediawiki/images/b/bb/Fishing_Treasure_Chest.png 2x"> <a href="/Fishing#Treasure_Chests" title="Fishing" data-uno-hassubmittext="no">Fishing Treasure Chest</a></span></li> <li class="no-wrap"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplateinline"><img alt="Hoe.png" src="/mediawiki/images/thumb/8/87/Hoe.png/24px-Hoe.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/8/87/Hoe.png/36px-Hoe.png 1.5x, /mediawiki/images/8/87/Hoe.png 2x"> <a href="/Hoes" title="Hoes" data-uno-hassubmittext="no">Tilling</a></span> on <a href="/The_Farm" title="The Farm" data-uno-hassubmittext="no">The Farm</a> </li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Tree of the Winter Star.png" src="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/24px-Tree_of_the_Winter_Star.png" decoding="async" width="24" height="40" srcset="/mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/36px-Tree_of_the_Winter_Star.png 1.5x, /mediawiki/images/thumb/c/cc/Tree_of_the_Winter_Star.png/48px-Tree_of_the_Winter_Star.png 2x"> <a href="/Feast_of_the_Winter_Star" title="Feast of the Winter Star" data-uno-hassubmittext="no">Feast of the Winter Star</a></span></li></ul>
</td>
<td>
</td></tr>
<tr>
<td><div class="center"><div class="floatnone"><a href="/File:Omni_Geode.png" class="image" data-uno-hassubmittext="no"><img alt="Omni Geode.png" src="/mediawiki/images/0/09/Omni_Geode.png" decoding="async" width="48" height="48"></a></div></div>
</td>
<td><a href="/Omni_Geode" title="Omni Geode" data-uno-hassubmittext="no">Omni Geode</a>
</td>
<td>A blacksmith can break this open for you. These geodes contain a wide variety of Minerals.
</td>
<td><span style="display: none;">data-sort-value="0"&gt;</span><span class="no-wrap"><img alt="Gold.png" src="/mediawiki/images/thumb/1/10/Gold.png/18px-Gold.png" decoding="async" width="18" height="18" srcset="/mediawiki/images/thumb/1/10/Gold.png/27px-Gold.png 1.5x, /mediawiki/images/thumb/1/10/Gold.png/36px-Gold.png 2x">0g</span>
</td>
<td><ul><li><a href="/The_Mines" title="The Mines" data-uno-hassubmittext="no">The Mines</a></li><li><a href="/Skull_Cavern" title="Skull Cavern" data-uno-hassubmittext="no">Skull Cavern</a></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Carbon Ghost.png" src="/mediawiki/images/thumb/5/5b/Carbon_Ghost.png/24px-Carbon_Ghost.png" decoding="async" width="24" height="36" srcset="/mediawiki/images/thumb/5/5b/Carbon_Ghost.png/36px-Carbon_Ghost.png 1.5x, /mediawiki/images/thumb/5/5b/Carbon_Ghost.png/48px-Carbon_Ghost.png 2x"> <a href="/Carbon_Ghost" title="Carbon Ghost" data-uno-hassubmittext="no">Carbon Ghost</a></span></li><li><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Copper Pan.png" src="/mediawiki/images/thumb/7/71/Copper_Pan.png/24px-Copper_Pan.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/7/71/Copper_Pan.png/36px-Copper_Pan.png 1.5x, /mediawiki/images/7/71/Copper_Pan.png 2x"> <a href="/Copper_Pan" title="Copper Pan" data-uno-hassubmittext="no">Panning</a></span></li><li><a href="/Oasis" title="Oasis" data-uno-hassubmittext="no">The Oasis</a> (Wednesdays)</li><li><a href="/Krobus" title="Krobus" data-uno-hassubmittext="no">Krobus</a> (Tuesdays)</li><li><a href="/Artifact_Spot#On_Ginger_Island" title="Artifact Spot" data-uno-hassubmittext="no">Ginger Island Artifact Spots</a></li><li><a href="/Volcano_Dungeon" title="Volcano Dungeon" data-uno-hassubmittext="no">Volcano Dungeon</a></li></ul>
</td>
<td class="no-wrap"><img alt="Gift Icon.png" src="/mediawiki/images/thumb/d/d8/Gift_Icon.png/24px-Gift_Icon.png" decoding="async" width="24" height="24" srcset="/mediawiki/images/thumb/d/d8/Gift_Icon.png/36px-Gift_Icon.png 1.5x, /mediawiki/images/d/d8/Gift_Icon.png 2x"> <a href="/Clint#Gifts" title="Clint" data-uno-hassubmittext="no">Clint</a>, <a href="/Dwarf#Gifts" title="Dwarf" data-uno-hassubmittext="no">Dwarf</a> (Loved Gift)<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r120955"><span class="nametemplate"><img alt="Fish Pond.png" src="/mediawiki/images/thumb/6/65/Fish_Pond.png/24px-Fish_Pond.png" decoding="async" width="24" height="31" srcset="/mediawiki/images/thumb/6/65/Fish_Pond.png/36px-Fish_Pond.png 1.5x, /mediawiki/images/thumb/6/65/Fish_Pond.png/48px-Fish_Pond.png 2x"> <a href="/Fish_Pond" title="Fish Pond" data-uno-hassubmittext="no">Fish Pond</a>&nbsp;(Quest)</span>
</td></tr></tbody><tfoot></tfoot></table>""",
]

# Initialize a list to store data from all tables
all_data = []

# Loop through each table
for html in htmlobj:
    id += 1
    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")

    # Find the table with the specified class
    table = soup.find("table", class_="wikitable")

    # Initialize a list to store the extracted data from the current table
    data = []

    # Find all rows in the table body (skip the header row)
    rows = table.find("tbody").find_all("tr")

    # Loop through each row
    for row in rows:
        columns = row.find_all("td")

        # print(columns)
        # print(
        #     [
        #         item.text
        #         for item in columns[6].find_all("a")
        #         if columns[6].find_all("a") != []
        #     ]
        # )

        # # Extract data from each column
        image = columns[0].find("img")["src"]
        name = columns[1].find("a").text
        description = columns[2].text.strip()
        # sell_price = columns[3].text.strip()
        # gemologist_sell_price = columns[4].text.strip()
        locations = [item.text for item in columns[5].find_all("a")]
        itemId = ""
        try:
            used_in = [
                item.text
                for item in columns[5 if id is 3 else 6].find_all("a")
                if columns[5 if id is 3 else 6].find_all("a") != []
            ]
        except:
            used_in = []

        for item_id, item_info in objectsJson.items():
            item_name = item_info.get(
                "name", ""
            ).lower()  # Get the item name (convert to lowercase for case-insensitive match)

            if name.lower() in item_name:
                itemId = item_id

        minerals[name] = {
            "locations": locations,
            "used_in": used_in,
            "id": itemId,
        }

with open("../../data/artifacts.json", "w") as f:
    json.dump({"artifacts": artifacts, "minerals": minerals}, f, separators=(",", ":"))

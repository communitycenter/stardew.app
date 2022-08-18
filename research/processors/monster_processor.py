import string
import requests, bs4

url = "https://stardewvalleywiki.com/Adventurer%27s_Guild"
r = requests.get(url)
soup = bs4.BeautifulSoup(r.text, "html.parser")

bundles = {}

for a in soup.find_all("tbody")[2]:
    for c in a:
        for cc in c:
            try:
                print(cc.find("b"))
            except:
                pass

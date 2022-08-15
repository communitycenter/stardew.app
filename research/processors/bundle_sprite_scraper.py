import requests, bs4

url = "https://stardewcommunitywiki.com/Bundles"
r = requests.get(url)
soup = bs4.BeautifulSoup(r.text, "html.parser")

bundles = {}

for a in soup.find_all("th"):
    for c in a:
        if c.name == "img" and "32px" in c["src"]:
            bundles[
                a.text.strip().replace(" Bundle", "")
            ] = f'https://stardewcommunitywiki.com{c["src"]}'

print(bundles)

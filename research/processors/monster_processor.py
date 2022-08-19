import string
import requests, bs4, re, json

url = "https://stardewvalleywiki.com/Adventurer%27s_Guild"
r = requests.get(url)
soup = bs4.BeautifulSoup(r.text, "html.parser")

bundles = {}


def clean_up_text(text):
    cleaned_up_symbols = (
        text.replace("\n", " ")
        .replace("\t", " ")
        .replace("\xa0", " ")
        .replace(":", "")
        .strip()
    )
    return re.sub(" +", " ", cleaned_up_symbols)


def fetch_tables(soup):
    tables = soup.find_all("table")
    return [tables[2]]


def fetch_header_from_table(table):
    headers = []
    for header in table.find_all("th"):
        headers.append(header.text.strip())
    return headers


def main():
    tables = fetch_tables(soup)
    headers = fetch_header_from_table(tables[0])

    bundle = {}

    td_tag_list = soup.find_all(
        lambda tag: tag.name == "td"
        and len(tag.attrs) == 1
        and tag.get("id", None) != None
    )
    td_tag_list_parsed = [x for x in td_tag_list if x.attrs.get("id")[:4] != "info"]

    for tag_list in td_tag_list_parsed:
        _children_in_tag = [x for x in tag_list.children]
        if _children_in_tag[0].name == "a":
            # ok so there is no more items in this one.
            bundles[tag_list.attrs.get("id")] = {}
            _find_all_tds_from_tag = tag_list.parent.find_all("td")

            _items = []
            for td in _find_all_tds_from_tag:
                _check_if_td_has_a_image = td.find("img")
                if _check_if_td_has_a_image:
                    _items.append(
                        (clean_up_text(td.text), _check_if_td_has_a_image["src"])
                    )
                else:
                    _items.append(clean_up_text(td.text))

            for header in headers:
                bundles[tag_list.attrs.get("id")][header] = _items[
                    headers.index(header)
                ]
        elif _children_in_tag[0].name == "b":
            _grab_title = clean_up_text(_children_in_tag[0].text)

            _items = [[]]
            for item in _children_in_tag:
                if item.name == "span":
                    _check_if_span_has_image = item.find("img")
                    if _check_if_span_has_image:
                        _items[0].append(
                            (clean_up_text(item.text), _check_if_span_has_image["src"])
                        )
                    else:
                        _items[0].append(clean_up_text(item.text))

                _grab_parent = item.parent.parent
                _find_all_tds_from_tag = _grab_parent.find_all("td")

                for td in _find_all_tds_from_tag[1:]:
                    _check_if_td_has_a_image = td.find("img")
                    if _check_if_td_has_a_image:
                        _items.append(
                            (clean_up_text(td.text), _check_if_td_has_a_image["src"])
                        )
                    else:
                        _items.append(clean_up_text(td.text))
                    
                    if len(_items) == len(headers):
                        bundles[_grab_title] = {}
                        for header in headers:
                            bundles[_grab_title][header] = _items[headers.index(header)]
                        break
                        



if __name__ == "__main__":
    main()
    json.dump(bundles, open("./data/monsters.json", "w"))

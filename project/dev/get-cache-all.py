import requests

for i in requests.get("http://127.0.0.1:8000/cache/request?url=https://gamertocoder.garena.co.th/api/minigames").json():
    requests.get("http://127.0.0.1:8000/cache/request?url=" + i["icon"])
    if i["images"] != None:
        for ii in i["images"]:
            requests.get("http://127.0.0.1:8000/cache/request?url=" + ii)

r = requests.get("http://127.0.0.1:8000/cache/request?url=https://gamertocoder.garena.co.th/api/assets").json()
for i in r:
    for ii in r[i]:
        requests.get("http://127.0.0.1:8000/cache/request?url=" + ii)
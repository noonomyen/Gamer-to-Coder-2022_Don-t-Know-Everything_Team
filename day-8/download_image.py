import json
import urllib.request
from PIL import Image
from shutil import copy

l = json.loads(open("./data.json", "r", encoding="utf-8").read())

for i in l:
    ft = "." + i["img"].split(".")[-1]
    fn = i['name'].replace(' ', '-')
    urllib.request.urlretrieve(i["img"], f"./web/raw_images/{fn + ft}")
    i["img"] = "images/" + fn
    cp = False
    if ft != ".svg":
        img = Image.open("./web/raw_images/" + fn + ft)
        if img.size[0] > 300:
            scale = img.size[0] / 300
            img = img.resize((int(img.size[0] / scale), int(img.size[1] / scale)), Image.Resampling.LANCZOS)
            img.save("./web/images/" + fn + ".png")
            i["img"] += ".png"
        else:
            cp = True
    else:
        cp = True
    if cp:
        i["img"] += ft
        copy("./web/raw_images/" + fn + ft, "./web/images")
    print(i["img"])

open("./web/list.json", "w", encoding="utf-8").write(json.dumps(l, indent=4))
import json

config = json.loads(open("card.json", "r").read())

template = open(config["template"]["file"], "r", encoding="utf-8").read().split("\n")
loop = template[config["template"]["start"] - 1:config["template"]["end"]]
temp = template[:config["template"]["start"] - 1]

for list_ in config["list"]:
    for line in loop:
        _ = line
        for r in list_:
            _ = _.replace("<<" + r + ">>", list_[r])
        temp.append(_)

open("./static/index.html", "w", encoding="utf-8").write(
    "\n".join(temp) + "\n" + "\n".join(template[config["template"]["end"]:])
)
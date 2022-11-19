var web_is_dark_mode = window.matchMedia('(prefers-color-scheme: dark)').matches;

config = {
    auto_switch_web_mode: false,
    default_web_mode: "light",
    cache_server: true
}

web_mode = [
    ["tag", "body", true],
    ["class", "card", false],
    ["tag", "a", false],
    ["class", "card_text_types", false]
];

function switch_web_mode(m, r) {
    function lm2dm(e, i) {
        if (i[2]) {
            e.classList.add(`${i[1]}_lm2dm`);
            setTimeout(() => {
                e.classList.add(`${i[1]}_dm`);
                e.classList.remove(`${i[1]}_lm2dm`);
            }, 1000);
        } else {
            e.classList.add(`${i[1]}_dm`);
        };
        if (r) {
            e.classList.remove(`${i[1]}_lm`);
        };
    };
    function dm2lm(e, i) {
        if (i[2]) {
            e.classList.add(`${i[1]}_dm2lm`);
            setTimeout(() => {
                e.classList.add(`${i[1]}_lm`);
                e.classList.remove(`${i[1]}_dm2lm`);
            }, 1000);
        } else {
            e.classList.add(`${i[1]}_lm`);
        };
        if (r) {
            e.classList.remove(`${i[1]}_dm`);
        };
    };
    if (m == "dark") {
        for (let i of web_mode) {
            if (i[0] == "tag") {
                for (let e of document.getElementsByTagName(i[1])) {
                    lm2dm(e, i);
                };
            } else if (i[0] == "class") {
                for (let e of document.getElementsByClassName(i[1])) {
                    lm2dm(e, i);
                };
            };
        };
    } else {
        for (let i of web_mode) {
            if (i[0] == "tag") {
                for (let e of document.getElementsByTagName(i[1])) {
                    dm2lm(e, i)
                };
            } else if (i[0] == "class") {
                for (let e of document.getElementsByClassName(i[1])) {
                    dm2lm(e, i)
                };
            };
        };
    };
};

var elements_card = document.getElementById("element_card");
var img_loading = [];
var card_loaded_animation_slideUp = [];

function img_loaded(img_n) {
    img_loading = img_loading.filter(item => item !== img_n)
};

function img_loaded_error(img_n) {
    console.log(`failed to load : ${img_n}`);
    img_loading = img_loading.filter(item => item !== img_n)
};

function loaded() {
    for (let i of document.getElementsByClassName("card_image")) {
        i.classList.add("card_loaded_animation_image");
    };
    for (let i of document.getElementsByClassName("card_title")) {
        i.classList.add("card_loaded_animation_title");
    };
    for (let i of document.getElementsByClassName("card_text")) {
        i.classList.add("card_loaded_animation_text");
    };
    setTimeout(() => {
        for (let i of document.getElementsByClassName("card_image")) {
            i.classList.remove("card_preload_animation_image");
            i.classList.remove("card_loaded_animation_image");
        };
        for (let i of document.getElementsByClassName("card_title")) {
            i.classList.remove("card_preload_animation_title");
            i.classList.remove("card_loaded_animation_title");
        };
        for (let i of document.getElementsByClassName("card_text")) {
            i.classList.remove("card_preload_animation_title");
            i.classList.remove("card_loaded_animation_text");
        };
    }, 2100);
};

function add_card(obj) {
    let card = document.createElement("li");

    let element = document.createElement("div");
    element.innerHTML = `<strong>ชื่อ:</strong> ${obj.name}`;
    element.classList.add("card_title");
    element.classList.add("card_preload_animation_title");
    card.appendChild(element);

    element = document.createComment(` source -> ${obj.img_src_comment}`);
    card.appendChild(element);

    element = document.createElement("div");
    img_loading.push(obj.img);
    let element_img = document.createElement("img");
    element_img.src = obj.img;
    element_img.alt = obj.name;
    element_img.onload = () => { img_loaded(obj.img) };
    element_img.onerror = () => { img_loaded_error(obj.img) };
    element_img.classList.add("card_image");
    element_img.classList.add("card_preload_animation_image");
    element_img.style.margin = `${obj.margin}px 0px`;
    element_img.onclick = () => { window.open(obj.img_src_comment) };
    element.appendChild(element_img);
    element.classList.add("card_image-frame");
    card.appendChild(element);

    element = document.createElement("div");

    let element_ = document.createElement("div");
    element_ = document.createElement("div");
    element_.innerHTML = `<strong>ประเภท:</strong>`;
    for (let i of obj.type.split(" ")) {
        let ele = document.createElement("div");
        ele.innerText = i;
        ele.classList.add("card_text_types");
        element_.appendChild(ele);
    };
    element_.classList.add("card_text");
    element_.classList.add("card_preload_animation_title");
    element.appendChild(element_);

    let element_a;

    element_ = document.createElement("div");
    element_.innerHTML = `<strong>รายละเอียด:</strong> ${obj.detail} `;
    if (obj.src_detail != null) {
        element_a = document.createElement("a");
        element_a.href = obj.src_detail;
        element_a.target = "_blank";
        element_a.innerText = "เพิ่มเติม";
        element_.appendChild(element_a);
    };
    element_.classList.add("card_text");
    element_.classList.add("card_preload_animation_title");
    element.appendChild(element_);

    if (obj.official_link != null) {
        element_ = document.createElement("div");
        element_a = document.createElement("a");
        element_a.href = obj.official_link;
        element_a.target = "_blank";
        element_a.innerText = obj.display_official_link;
        element_.innerHTML = `<strong>เว็บทางการ:</strong> `;
        element_.appendChild(element_a);
        element_.classList.add("card_text");
        element_.classList.add("card_preload_animation_title");
        element.appendChild(element_);
    };

    element.classList.add("card_text_description");
    card.appendChild(element);

    card.classList.add("card");
    card.onclick = () => {
        //
    };
    elements_card.appendChild(card);
};

function wait(i) {
    setTimeout(() => {
        if (img_loading.length == 0 || i > 20) {
            document.getElementById("loading__").style.display = "none";
            document.getElementById("content__").style.display = "block";
            loaded();
        } else {
            wait(i + 1);
        };
    }, 500);
};

fetch("/api/get-url").then((response) => {
    if (response.status !== 200){
        return response.status;
    }
    return response.json();
}).then((data) => {
    if (typeof data == "number") {
        alert(data);
    } else {
        let Convert = data.convert;
        let url = data.url;
        if (config.cache_server) {
            url = "/cache/request?url=" + url
        };
        fetch(url).then((response) => {
            if (response.status !== 200){
                return response.status;
            }
            return response.json();
        }).then((data) => {
            if (typeof data == "number") {
                alert(data);
            } else {
                if (Convert) {
                    for (let k in data) {
                        if (config.cache_server) {
                            data[k]["img"] = "/cache/request?url=" + data[k]["icon"];
                        } else {
                            data[k]["img"] = data[k]["icon"];
                        };
                        delete data[k]["icon"];
                        data[k]["margin"] = 0;
                        delete data[k]["no"];
                        data[k]["type"] = data[k]["genre"].join(" ");
                        delete data[k]["genre"];
                        data[k]["detail"] = data[k]["description"];
                        delete data[k]["description"];
                        data[k]["img_src_comment"] = data[k]["img"];
                        data[k]["src_detail"] = null;
                        data[k]["official_link"] = null;
                        data[k]["display_official_link"] = null;
                    };
                };
                list = data;
                for (let i of list) {
                    add_card(i);
                };
                if (config.auto_switch_web_mode) {
                    if (web_is_dark_mode) {
                        switch_web_mode("dark", false);
                    } else {
                        switch_web_mode("light", false);
                    };
                    setInterval(() => {
                        let is_dark_mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        if (is_dark_mode && !web_is_dark_mode) {
                            console.log("switch to dark mode");
                            web_is_dark_mode = true;
                            switch_web_mode("dark", true);
                        } else if (!is_dark_mode && web_is_dark_mode) {
                            console.log("switch to light mode");
                            web_is_dark_mode = false;
                            switch_web_mode("light", true);
                        };
                    }, 1000);
                } else {
                    switch_web_mode(config.default_web_mode, false);
                };
                wait(0);
            };
        });
    };
});

document.getElementById("switch_web_mode_value").onclick = () => {
    if (document.getElementById("switch_web_mode_value").checked) {
        switch_web_mode("dark", true);
    } else {
        switch_web_mode("light", true);
    };
};

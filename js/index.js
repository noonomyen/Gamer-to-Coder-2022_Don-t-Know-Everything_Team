// link download เกม
var download_link = {
    windows: "https://pc.blockmanmobile.com/#/",
    apple_store: "https://apps.apple.com/app/id1571913622",
    google_play: "https://play.google.com/store/apps/details?id=com.app.blockmango"
}

var Root = document.querySelector(":root");

// ปุ่ม navbar
var btn_navbar = [
    document.getElementById("btn_mini_game"),
    document.getElementById("btn_blockman_go"),
    document.getElementById("btn_characters")
];

// หน้าเว็บ
var Container = {
    mini_games: document.getElementById("mini_games"),
    blockman_go: document.getElementById("blockman_go"),
    characters: document.getElementById("characters")
};

// ครอบ url("") ให้ string สำหรับ css variables
function css_url(url) {
    return `url("${url}")`;
};

// #blockman_go เรียก / ออก popup download other
function download_other_popup(action) {
    let display = "none";
    if (action) {
        display = "block";
    };
    document.querySelector("#blockman_go div.download-other-background-blur").style.display = display;
    document.querySelector("#blockman_go div.download-other").style.display = display;
};

// int ใช้เก็บว่าตอนนี้อยู่หน้าไหน
var ActiveContent = null;
// เปลี่ยนเนื้อหาในหน้าเว็บ โดยจะส่งกลับเป็นเลขลำลับของปุ่มใน btn_navbar
function SwitchContent(to) {
    // hardcode
    let body = document.body.classList
    if (to == "btn_mini_game" || to == "#mini-games" || to == 0) {
        body.add("background_body_minigames");
        body.remove("background_body_blockman_go");
        body.remove("background_body_characters");
        Container.blockman_go.style.display = "none";
        Container.characters.style.display = "none";
        Container.mini_games.style.display = "block";
        ActiveContent = 0;
        // clear หน้า #blockman-go
        download_other_popup(false);
    } else if (to == "btn_blockman_go" || to == "#blockman-go" || to == 1) {
        body.add("background_body_blockman_go");
        body.remove("background_body_minigames");
        body.remove("background_body_characters");
        Container.characters.style.display = "none";
        Container.mini_games.style.display = "none";
        Container.blockman_go.style.display = "block";
        ActiveContent = 1;
    } else if (to == "btn_characters" || to == "#characters" || to == 2) {
        body.add("background_body_characters");
        body.remove("background_body_minigames");
        body.remove("background_body_blockman_go");
        Container.mini_games.style.display = "none";
        Container.blockman_go.style.display = "none";
        Container.characters.style.display = "block";
        ActiveContent = 2;
        // clear หน้า #blockman-go
        download_other_popup(false);
    };
    if (document.querySelector(".nav ul li.active") != null) {
        document.querySelector(".nav ul li.active").classList.remove("active");
    }
    btn_navbar[ActiveContent].classList.add("active");

    // ซ้อนปุ่มกดด้านข้างจอ ถ้าหน้าที่กำลังใช้อยู่มันกดไปต่อไม่ได้
    if (ActiveContent == 0) {
        document.querySelector("#btn_arrow div.left").style.display = "none";
    } else {
        document.querySelector("#btn_arrow div.left").style.display = "flex";
    };
    if (ActiveContent == 2) {
        document.querySelector("#btn_arrow div.right").style.display = "none";
    } else {
        document.querySelector("#btn_arrow div.right").style.display = "flex";
    };
};

// เริ่มหลังเรียก api เสร็จ
GetResource(["assets", "minigames"], (resource) => {
    Root.style.setProperty("--background-body-minigame", css_url(resource.assets.wallpaper.GetURL("01.jpg")));
    Root.style.setProperty("--background-body-blockman_go", css_url(resource.assets.banner.GetURL("01.png")));
    Root.style.setProperty("--background-body-characters", css_url(resource.assets.banner.GetURL("02.png")));

    // add icon
    let link_icon = document.querySelector("link[rel~='icon']");
    if (!link_icon) {
        link_icon = document.createElement('link');
        link_icon.rel = "icon";
        document.getElementsByTagName('head')[0].appendChild(link_icon);
    }
    link_icon.href = resource.assets.benny.GetURL("02.png");

    // ลูกเล่นปุ่ม navbar
    for (let i in btn_navbar) {
        btn_navbar[i].onmouseover = () => {
            btn_navbar[(i + 1) % 3].classList.add("deactive");
            btn_navbar[(i + 2) % 3].classList.add("deactive");
        };
        btn_navbar[i].onmouseout = () => {
            btn_navbar[(i + 1) % 3].classList.remove("deactive");
            btn_navbar[(i + 2) % 3].classList.remove("deactive");
        };
        btn_navbar[i].onclick = () => {
            SwitchContent(btn_navbar[i].id);
        };
    };

    // รูป logo หน้า #blockman_go
    let blockman_go_logo = document.querySelector("#blockman_go .center-bottom img");
    blockman_go_logo.crossOrigin = "Anonymous";
    blockman_go_logo.src = resource.assets.logo.GetURL("01.png");
    // outline logo
    blockman_go_logo.onload = () => {
        blockman_go_logo.onload = null;;
        let canvas = document.createElement("canvas");
        canvas.width = blockman_go_logo.naturalWidth + 20;
        canvas.height = blockman_go_logo.naturalHeight + 20;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(blockman_go_logo, 0, 0);
        // https://stackoverflow.com/a/28416298/17707397
        let dArr = [-1,-1, 0,-1, 1,-1, -1,0, 1,0, -1,1, 0,1, 1,1],
            s = 5,
            i = 0,
            x = 5,
            y = 5;
        for(; i < dArr.length; i += 2)
          ctx.drawImage(blockman_go_logo, x + dArr[i]*s, y + dArr[i+1]*s);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "rgba(78, 78, 78, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(blockman_go_logo, x, y);
        blockman_go_logo.src = ctx.canvas.toDataURL();
    };

    // หน้า #mini_games เพิ่มรายการเกม
    let minigames_game_list = document.querySelector("#mini_games div.frame div.container div.left");
    let minigames_game_list_view = document.querySelector("#mini_games div.frame div.container div.right");
    // ต้องนับเองเพราะว่าใน resource.minigames มี function เสริมจาก resource manager (resource.js) ที่ยัดตัว
    // GetURL กับ GetObjByKeyValue มาด้วย ซึ่งมันไม่ใช่ข้อมูลที่ต้องการแสดงผลเลยต้องข้าม
    let _count = 0;
    let minigames_game_list_view_interval = null;
    for (let i in resource.minigames) {
        if (typeof(i) == "number" || _count < 12) {
            i = resource.minigames[i];
            // create box
            let item = document.createElement("div");
            let icon = document.createElement("img");
            item.classList.add("item");
            icon.src = i.icon;
            item.appendChild(icon);
            let img_list = [];
            for (let ii in i.images) {
                if (ii != "GetObjByKeyValue" && ii != "GetURL") {
                    let div = document.createElement("div");
                    let img = document.createElement("img");
                    img.src = i.images[ii];
                    div.classList.add("item");
                    div.appendChild(img);
                    img_list.push(div);
                };
            };
            // ถ้าไม่มีรูป
            if (img_list.length == 0) {
                let div = document.createElement("div");
                let span = document.createElement("span");
                span.innerText = "ไม่มีรูป";
                div.classList.add("item");
                div.appendChild(span);
                img_list.push(div);
            };
            item.onclick = () => {
                minigames_game_list_view.querySelector("div.name").innerText = i.name;
                let genre_HTML = "";
                for (let genre of i.genre) {
                    genre_HTML += `<span>${genre}</span>`;
                };
                minigames_game_list_view.querySelector("div.genre").innerHTML = genre_HTML;
                minigames_game_list_view.querySelector("div.description").innerText = i.description;
                minigames_game_list_view.querySelector("div.name").classList.remove("animation");
                minigames_game_list_view.querySelector("div.genre").classList.remove("animation");
                minigames_game_list_view.querySelector("div.description").classList.remove("animation");
                setTimeout(() => {
                    minigames_game_list_view.querySelector("div.name").classList.add("animation");
                    minigames_game_list_view.querySelector("div.genre").classList.add("animation");
                    minigames_game_list_view.querySelector("div.description").classList.add("animation");
                }, 10)
                if (minigames_game_list_view_interval != null) {
                    clearInterval(minigames_game_list_view_interval);
                };
                if (minigames_game_list_view.querySelector("div.img div.item.active") != null) {
                    minigames_game_list_view.querySelector("div.img div.item.active").classList.remove("active")
                };
                minigames_game_list_view.querySelector("div.img").innerHTML = "";
                for (let i of img_list) {
                    minigames_game_list_view.querySelector("div.img").appendChild(i);
                };
                if (img_list.length != 0) {
                    img_list[0].classList.add("active")
                };
                // เปลี่ยนรูปเอง delay 2s
                minigames_game_list_view_interval = setInterval(() => {
                    if (img_list.length != 0) {
                        let active_element = null;
                        for (let ii in img_list) {
                            if (img_list[ii].classList.contains("active") == true) {
                                active_element = Number(ii);
                                break;
                            };
                        };
                        if (active_element == null) {
                            img_list[0].classList.add("active")
                        } else if (img_list.length != 1) {
                            img_list[(active_element + 1) % img_list.length].classList.add("active");
                            img_list[active_element].classList.remove("active");
                        };
                    };
                }, 2000);
            };
            // เลือกตัวแรก (ค่าเริ่มต้น)
            if (_count == 0) {
                item.onclick();
            };
            minigames_game_list.appendChild(item);
            _count += 1;
        } else if (typeof(i) == "number" && _count > 11) {
            console.log("The number exceeds the designed limit.");
        };
    };

    // #characters รายการตัวละคร
    let character_list_container = document.querySelector("#characters div.frame div.container div.left");
    let _start = true;
    function character_name_reset_animation() {
        let tmp = document.querySelector("#characters div.frame div.container div.right div.name");
        let tmp1 = document.querySelector("#characters div.frame div.container div.right div.img");
        tmp.classList.remove("animation")
        tmp1.classList.remove("animation")
        setTimeout(() => {
            tmp.classList.add("animation");
            tmp1.classList.add("animation")
        }, 10)
    };
    for (let name in resource.assets.character_group) {
        let div = document.createElement("div");
        let img = document.createElement("img");
        img.src = resource.assets.character_group[name][0];
        img.crossOrigin = "Anonymous";
        div.onclick = () => {
            document.querySelector("#characters div.frame div.container div.right div.name").innerText = name;
            document.querySelector("#characters div.frame div.container div.right img").src = img.src;
            character_name_reset_animation();
        };
        if (img.src.slice(0, 4) != "data") {
            if (_start) {
                _start = false;
                img.onload = () => {
                    img.onload = null;
                    let rt = remove_transparent(img);
                    resource.assets.character_group[name][0] = rt;
                    img.src = rt;
                    div.onclick();
                };
            } else {
                img.onload = () => {        
                    img.onload = null;
                    let rt = remove_transparent(img);
                    resource.assets.character_group[name][0] = rt;
                    img.src = rt;
                };
            };
        };
        div.appendChild(img);
        div.classList.add("item");
        character_list_container.appendChild(div);
    };
});


// เข็คว่าตอนเข้าเว็บมามี hash ติดมาด้วยไหม ถ้ามีก็จะส่งไปเปลี่ยนหน้าในเว็บไปที่กำหมดแต่ถ้าไม่ก็ไปหน้าแรก
// หน้าแรกค่าเริ่มต้น #blockman-go
if (window.location.hash != "") {
    SwitchContent(window.location.hash);
} else {
    SwitchContent("#blockman-go");
};

function check_hash() {
    
};

// ปุ่มกดเลื่อนหน้าด้านข้างจอ
document.querySelector("#btn_arrow div.left").onclick = () => {
    SwitchContent(ActiveContent - 1);
};
document.querySelector("#btn_arrow div.right").onclick = () => {
    SwitchContent(ActiveContent + 1);
};

// #blockman_go download-now
// download ตาม os ถ้าไม่ทราบจะ download ของ windows
document.querySelector("#blockman_go a.download-now").onclick = () => {
    // https://stackoverflow.com/a/38241481/17707397
    let platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    if (["Win32", "Win64", "Windows"].indexOf(platform) !== -1) {
        window.open(download_link.windows);
    } else if (/Android/.test(window.navigator.userAgent)) {
        window.open(download_link.windows);
    } else if (["iPhone", "iPad", "iPod"].indexOf(platform) !== -1) {
        window.open(download_link.windows);
    } else {
        window.open(download_link.windows);
    };
};

// #blockman_go download-other ออกจาก popup
document.querySelector("#blockman_go div.download-other-background-blur").onclick = () => {
    download_other_popup(false);
};
document.querySelector("#blockman_go div.download-other div i").onclick = () => {
    download_other_popup(false);
};

// #blockman_go download-other เรียก popup
document.querySelector("#blockman_go div.center-bottom a.download-other").onclick = () => {
    download_other_popup(true);
};

// #blockman_go download-other ปุ่ม download
document.querySelector("#blockman_go div.download-other div.container-platform-download div.app-store").onclick = () => {
    window.open(download_link.apple_store);
    download_other_popup(false);
};
document.querySelector("#blockman_go div.download-other div.container-platform-download div.google-play").onclick = () => {
    window.open(download_link.google_play);
    download_other_popup(false);
};
document.querySelector("#blockman_go div.download-other div.container-platform-download div.windows").onclick = () => {
    window.open(download_link.windows);
    download_other_popup(false);
};

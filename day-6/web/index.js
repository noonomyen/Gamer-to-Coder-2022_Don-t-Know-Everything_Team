var elements_card = document.getElementById("element_card");

function add_card(obj) {
    let card = document.createElement("li");

    let element = document.createElement("div");
    element.innerHTML = `<strong>ชื่อ:</strong> ${obj.name}`;
    element.classList.add("card_text");
    element.classList.add("card_title");
    card.appendChild(element);

    element = document.createComment(` source -> ${obj.img_src_comment}`);
    card.appendChild(element);

    element = document.createElement("div");
    let element_img = document.createElement("img");
    element_img.src = obj.img;
    element_img.alt = obj.name;
    element_img.classList.add("card_image");
    element_img.style.margin = `${obj.margin}px 0px`;
    element_img.onclick = () => { window.open(obj.img_src_comment) };
    element.appendChild(element_img);
    element.classList.add("card_image-frame");
    card.appendChild(element);

    element = document.createElement("div");
    element.innerHTML = `<strong>ประเภท:</strong> ${obj.type}`;
    element.classList.add("card_text");
    card.appendChild(element);

    element = document.createElement("div");
    element.innerHTML = `<strong>รายละเอียด:</strong> ${obj.detail} `;
    let element_a = document.createElement("a");
    element_a.href = obj.src_detail;
    element_a.target = "_blank";
    element_a.innerText = "เพิ่มเติม";
    element.appendChild(element_a);
    element.classList.add("card_text");
    card.appendChild(element);

    element = document.createElement("div");
    element_a = document.createElement("a");
    element_a.href = obj.official_link;
    element_a.target = "_blank";
    element_a.innerText = obj.display_official_link;
    element.innerHTML = `<strong>เว็บทางการ:</strong> `;
    element.appendChild(element_a);
    element.classList.add("card_text");
    card.appendChild(element);

    card.classList.add("card");
    elements_card.appendChild(card);
};

const list = [
    {
        "name": "Genshin Impact",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Genshin_Impact_logo.svg",
        "img": "https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg",
        "margin": 35,
        "type": "Action role-playing",
        "detail": "เป็นเกมผจญภัยในโลกเปิดที่พัฒนาโดย มิโฮโยะ ผู้พัฒนาเกมสัญชาติจีน",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B9%80%E0%B8%81%E0%B9%87%E0%B8%99%E0%B8%8A%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%B4%E0%B8%A1%E0%B9%81%E0%B8%9E%E0%B8%81%E0%B8%95%E0%B9%8C",
        "official_link": "https://genshin.hoyoverse.com",
        "display_official_link": "genshin.hoyoverse.com"
    },
    {
        "name": "Osu!",
        "img_src_comment": "https://commons.wikimedia.org/wiki/File:Osu!_Logo_2016.svg",
        "img": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Osu%21_Logo_2016.svg",
        "margin": 10,
        "type": "Rhythm",
        "detail": "เป็นโปรแกรมฟรีแวร์ที่พัฒนาโดย ดีน เฮอร์เบิร์ต โดยมแรงบันดาลใจจากเกม โอ๊ทส์! ทาทาคาเอะ! โอเอนดัน, ไทโกะโนะทะสึจิน, โอทูแจม และบีทมาเนีย ทูดีเอกซ์",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B9%82%E0%B8%AD%E0%B8%AA%E0%B8%B8!",
        "official_link": "https://osu.ppy.sh",
        "display_official_link": "osu.ppy.sh"
    },
    {
        "name": "Free Fire",
        "img_src_comment": "https://th.wikipedia.org/wiki/%E0%B9%84%E0%B8%9F%E0%B8%A5%E0%B9%8C:Garena_Free_Fire_Logo.jpg",
        "img": "https://upload.wikimedia.org/wikipedia/th/b/b5/Garena_Free_Fire_Logo.jpg",
        "margin": 40,
        "type": "Battle royale",
        "detail": "เป็นเกมแบตเทิลรอยัลพัฒนาโดย 111 ดอตส์สตูดิโอ และวางจำหน่ายโดยการีนา",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%84%E0%B8%9F%E0%B8%A3%E0%B9%8C",
        "official_link": "https://ff.garena.com",
        "display_official_link": "ff.garena.com"
    },
    {
        "name": "Need For Speed Heat",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Cover_Art_of_Need_for_Speed_Heat.png",
        "img": "https://upload.wikimedia.org/wikipedia/en/7/7f/Cover_Art_of_Need_for_Speed_Heat.png",
        "margin": 0,
        "type": "Racing",
        "detail": "เป็นวิดีโอเกมแนวแข่งรถ พัฒนาโดยโกสต์เกมส์ และจัดจำหน่ายโดยอิเล็กทรอนิก อาตส์",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B8%99%E0%B8%B5%E0%B8%94%E0%B8%9F%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%AA%E0%B8%9B%E0%B8%B5%E0%B8%94%E0%B8%AE%E0%B8%B5%E0%B8%95",
        "official_link": "https://www.ea.com/games/need-for-speed/need-for-speed-heat",
        "display_official_link": "www.ea.com/games/need-for-speed/need-for-speed-heat"
    },
    {
        "name": "Terraria",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:TerrariaLogo2.png",
        "img": "https://upload.wikimedia.org/wikipedia/en/4/42/TerrariaLogo2.png",
        "margin": 30,
        "type": "Action-adventure Sandbox",
        "detail": "เป็นเกมแซนด์บอกซ์ 2D จาก Re-Logic",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B9%80%E0%B8%97%E0%B8%AD%E0%B8%A3%E0%B8%B2%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2",
        "official_link": "https://terraria.org/",
        "display_official_link": "terraria.org"
    },
    {
        "name": "Minecraft",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Minecraft_cover.png",
        "img": "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
        "margin": 0,
        "type": "Sandbox survival",
        "detail": "เป็นวิดีโอเกมแซนด์บ็อกซ์ที่พัฒนาโดยบริษัทพัฒนาเกมสวีเดน Mojang Studios สร้างขึ้นโดยนักออกแบบเกมชาวสวีเดน Markus Persson หรือ Notch",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B9%84%E0%B8%A1%E0%B8%99%E0%B9%8C%E0%B8%84%E0%B8%A3%E0%B8%B2%E0%B8%9F%E0%B8%95%E0%B9%8C",
        "official_link": "https://www.minecraft.net",
        "display_official_link": "www.minecraft.net"
    },
    {
        "name": "Honkai Impact",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Honkai_Impact_3rd_logo.png",
        "img": "https://upload.wikimedia.org/wikipedia/en/d/da/Honkai_Impact_3rd_logo.png",
        "margin": 10,
        "type": "Role-playing RPG",
        "detail": "เป็นเกมสวม บทบาทแอ็กชัน 3D พัฒนาและเผยแพร่โดย miHoYo",
        "src_detail": "https://en.wikipedia.org/wiki/Honkai_Impact_3rd",
        "official_link": "https://honkaiimpact3.hoyoverse.com/global",
        "display_official_link": "honkaiimpact3.hoyoverse.com/global"
    },
    {
        "name": "Blue Archives",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Blue_Archives_cover.jpeg",
        "img": "https://upload.wikimedia.org/wikipedia/en/4/4b/Blue_Archives_cover.jpeg",
        "margin": 10,
        "type": "Role-playing",
        "detail": "เป็นเกมเล่นตามบทบาท ที่พัฒนาโดยเน็กซอนเกม (เดิมชื่อ NAT Games) ซึ่งเป็นบริษัทในเครือของเน็กซอน",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B8%9A%E0%B8%A5%E0%B8%B9_%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%84%E0%B8%84%E0%B8%9F%E0%B9%8C",
        "official_link": "https://bluearchive.nexon.com/home",
        "display_official_link": "bluearchive.nexon.com/home"
    },
    {
        "name": "Grand Theft Auto V",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Grand_Theft_Auto_V.png",
        "img": "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
        "margin": 0,
        "type": "Action-adventure",
        "detail": "เป็นเกมแอ็กชันผจญภัย พัฒนาโดยร็อกสตาร์นอร์ท และจัดจำหน่ายโดยร็อกสตาร์เกมส์",
        "src_detail": "https://th.wikipedia.org/wiki/%E0%B9%81%E0%B8%81%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B9%80%E0%B8%97%E0%B8%9F%E0%B8%95%E0%B9%8C%E0%B8%AD%E0%B8%AD%E0%B9%82%E0%B8%95_V",
        "official_link": "https://www.rockstargames.com/gta-v",
        "display_official_link": "www.rockstargames.com/gta-v"
    },
    {
        "name": "Point Blank",
        "img_src_comment": "https://en.wikipedia.org/wiki/File:Pointblanklogo.jpg",
        "img": "https://upload.wikimedia.org/wikipedia/en/5/57/Pointblanklogo.jpg",
        "margin": 10,
        "type": "Light-gun-shooter",
        "detail": " เป็นวิดีโอเกมยิงมุมมองบุคคลที่หนึ่ง ที่พัฒนาโดยบริษัท Zepetto ของเกาหลีใต้",
        "src_detail": "https://en.wikipedia.org/wiki/Point_Blank_(2008_video_game)",
        "official_link": "https://pointblank.zepetto.com",
        "display_official_link": "pointblank.zepetto.com"
    }
]

for (let i of list) {
    add_card(i);
};

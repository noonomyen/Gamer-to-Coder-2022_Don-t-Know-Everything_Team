// แก้ไขข้อมูลบ้างอย่างใน resource
function Resource_fix_something(obj) {
    if (obj.minigames != null) {
        obj.minigames.GetObjByKeyValue("name", "Egg Wark")["name"] = "Egg War";
    };
};

// แหล่งข้อมูล
var resource = {
    url: {
        assets: "",
        minigames: "",
        minigame: ""
    }
};

function assets_character_group(obj) {
    // get character name by file name abc_dfg_00.png -> Abc Dfg
    // return [name, file number]
    function get_character_name(filename) {
        let tmp = filename.split("_");
        let name = tmp.slice(0, -1);
        for (let i in name) {
            name[i] = name[i].charAt(0).toUpperCase() + name[i].slice(1);
        };
        return {
            name: name.join(" "),
            file_number: Number(tmp.slice(-1)[0].split(".")[0] - 1)
        };
    };
    // #characters character-list
    // แยกไฟล์ทีมีชื่อซํ้ากัน
    let images_group = {};
    for (let url of obj.characters) {
        let file = get_character_name(url.split("/").slice(-1)[0]);
        if (images_group[file.name] == null) {
            images_group[file.name] = [];
            images_group[file.name][file.file_number] = url;
        } else {
            images_group[file.name][file.file_number] = (url);
        };
    };
    return images_group;
};

// เรียกข้อมูลจากแหล่งข้อมูลครั้งเดียว แล้วส่งคืนทาง callback function
function GetResource(request, callback) {
    // นับว่า fetch api นั้นทำงานครบหมดแล้วหรือยังก่อนเรียก callback function
    let semaphore = request.length;
    function next() {
        semaphore -= 1;
        if (semaphore == 0) {
            Resource_fix_something(resource);
            callback(resource);
        };
    };
    // ใช้หา URL เต็มจาก array ด้วยชื่อไฟล์ หรือ path ลงท้าย
    function GetURL(val) {
        for (let i in this) {
            if (typeof(this[i]) == "string") {
                let tmp = this[i].split("/");
                if (tmp[tmp.length - 1] == val) {
                    return this[i];
                };
            };
        };
        return null;
    };
    // ใช้หา object โดยใช้ key และ value เพื่อรับ object หลัก
    function GetObjByKeyValue(key, val) {
        for (let i in this) {
            if (typeof(this[i]) == "object" && this[i] != null && this[i][key] != null) {
                if (this[i][key] == val) {
                    return this[i];
                };
            };
        };
        return null;
    };
    // ฉีด function GetURL และ GetObjByKeyValue เข้าไปใน object
    // ถ้ามี assets จะทำการคัดแยกตัวละคร แบ่งตามชื่อ โดยเรียกใช้ assets_character_group function
    function inject_func_GET(obj) {
        for (let i in obj) {
            if (typeof(obj[i]) == "object") {
                for (let ii in obj[i]) {
                    if (typeof(obj[i][ii]) == "object" && obj[i][ii] != null) {
                        obj[i][ii].GetURL = GetURL;
                        obj[i][ii].GetObjByKeyValue = GetObjByKeyValue;
                    };
                };
                obj[i].GetURL = GetURL;
                obj[i].GetObjByKeyValue = GetObjByKeyValue;
            };
        };
        obj.GetURL = GetURL;
        obj.GetObjByKeyValue = GetObjByKeyValue;
        if (obj.characters != null) {
            obj.character_group = assets_character_group(obj);
        }
        return obj;
    };
    for (let i of request) {
        let url;
        // เช็คว่าคำขอคืออะไร
        // String คือ ต้องการ GET ด้วย URL นั้นอย่างเดียว
        // Object - i[0] คือชื่อ url ส่วน i[1] คือข้อมูลที่ต้องนำมาต่อท้าย
        if (typeof(i) == "string" && resource.url[i] != null) {
            url = resource.url[i]
        } else if (typeof(i) == "object" && resource.url[i[0]] != null) {
            url = resource.url[i[0]] + i[1]
        } else {
            // ไม่มีที่อยู่ URL สำหรับคำขอดึงข้อมูล
            console.log(`ERROR : The URL address for the fetch request does not exist. [${i}]`);
            next();
            continue
        };
        // เรียก api
        fetch(url).then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    if (typeof(i) == "string") {
                        inject_func_GET(data);
                        resource[i] = data;
                    } else if (typeof(i) == "object") {
                        if (resource[i[0]] == null) {
                            resource[i[0]] = {};
                        };
                        inject_func_GET(data);
                        resource[i[0]][i[1].toString()] = data;
                    };
                    next();
                });
            } else {
                // เกิดข้อผิดพลาดในเรียกขอข้อมูลจาก server
                console.log(`ERROR : Failed to request data from [${i}]`);
                next();
            }
        });
    }
};

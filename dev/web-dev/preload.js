const PROXY = "/cache/request?url=";

// url redirect
function RedirectURL(str) {
    return PROXY + str;
};

// auto url redirect
function RedirectURL_OBJ(resource) {
    function self_replace(obj) {
        for (let i in obj) {
            if (typeof(obj[i]) == "string" && (obj[i].indexOf("http") == 0)) {
                obj[i] = RedirectURL(obj[i]);
            } else if (typeof(obj[i]) == "object" && obj[i] != null) {
                self_replace(obj[i]);
            };
        };
    };
    self_replace(resource);
};
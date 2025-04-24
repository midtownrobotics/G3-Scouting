var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function postDataAdmin(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "/admin/";
        console.log(url);
        return fetch(url, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then((data) => __awaiter(this, void 0, void 0, function* () {
            return yield data.json();
        }));
    });
}
export function postDataGeneral(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "/post/";
        console.log(url);
        return fetch(url, {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
            console.log(data);
            return data;
        });
    });
}
$(document).ready(function () {
    $('#logout-button').on('click', () => {
        logoutUser();
    });
});
function logoutUser() {
    fetch('/logout');
    window.location.reload();
}
export function parseIntPlus(val) {
    if (typeof val == "number")
        return val;
    if (typeof val == "string")
        return parseInt(val);
    if (typeof val == "undefined")
        return undefined;
    return parseInt(val.toString());
}
export function parseStringArray(val) {
    if (typeof val == "object")
        return val;
    if (typeof val == "number")
        val = val.toString();
    if (typeof val == "string") {
        val = val.split(",");
        const newValList = [];
        val.forEach((v) => newValList.push(v.trim()));
        return newValList;
    }
    return [];
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { postDataGeneral, parseIntPlus } from "./global.js";
if ('scrollRestoration' in history) {
    history.scrollRestoration = "manual";
}
$(() => {
    window.scrollTo(0, 0);
    const alliance = localStorage.getItem("alliance");
    if (alliance)
        $("#allianceInput").val(alliance);
    const loadedFormData = loadFormFromLocalStorage();
    if (loadedFormData) {
        window.scrollTo(0, 99999999);
        alert("Please resubmit the form. If the issue persists, please contact an admin.");
        saveFormToLocalStorage(false);
    }
});
let currentForm = (_a = new URLSearchParams(window.location.search).get('form')) !== null && _a !== void 0 ? _a : "NONE";
if (!currentForm) {
    window.location.href = "/forms";
    currentForm = "";
}
$('#submitButton').on('click', function (e) {
    submitForm();
});
$(".plus").on('click', function () {
    var _a;
    $(this).prev().children().first().val(((_a = parseIntPlus($(this).prev().children().first().val())) !== null && _a !== void 0 ? _a : 0) + 1);
});
$(".minus").on('click', function () {
    var _a;
    const val = (_a = parseIntPlus($(this).next().children().first().val())) !== null && _a !== void 0 ? _a : 0;
    $(this).next().children().first().val(val <= 1 ? 0 : (val - 1));
});
function submitForm() {
    const alliance = $("#allianceInput").val();
    if (alliance) {
        localStorage.setItem("alliance", alliance.toString());
    }
    const formData = $('form').serializeArray();
    formData.push({ name: "timestamp", value: formatDate(new Date()) });
    const matchNumber = parseIntPlus($("#matchNum").val());
    $('#submitButton').attr("disabled", "disabled");
    $('#submitButton').html(`<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`);
    let dataPosted = false;
    postDataGeneral({
        action: "postFormData",
        form: currentForm,
        data: formData,
        matchNumber
    }).then(function (res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (res.status == "OK") {
                dataPosted = true;
                setTimeout(() => window.location.reload(), 500);
            }
        });
    });
    setTimeout(() => {
        if (!dataPosted) {
            alert("Form could not save! The current data will save to your device and the page will reload. Please try submitting again.");
            saveFormToLocalStorage(formData);
            setTimeout(() => window.location.reload(), 500);
        }
    }, 4000);
}
function formatDate(date) {
    return [date.getMonth(), "/", date.getDate(), "/", date.getFullYear().toString().substring(2), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds()].join("");
}
function saveFormToLocalStorage(formData) {
    localStorage.setItem(`formData:${currentForm}`, JSON.stringify(formData));
}
function loadFormFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem(`formData:${currentForm}`) || "null");
    if (data) {
        data.forEach((p) => $(`[name="${p.name}"]`).val(p.value));
        return true;
    }
    else {
        return false;
    }
}

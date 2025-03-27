import { postDataGeneral, parseIntPlus, getNextMatchInfo } from "./global.js"

if ('scrollRestoration' in history) {
    history.scrollRestoration = "manual";
}

$(() => {
    window.scrollTo(0,0)
    const loadedFormData = loadFormFromLocalStorage();
    if (loadedFormData) {
        window.scrollTo(0, 99999999)
        alert("Please resubmit the form. If the issue persists, please contact an admin.")
        saveFormToLocalStorage(false)
    }
});

let currentForm: string = new URLSearchParams(window.location.search).get('form') ?? "NONE"

if (!currentForm) {
    window.location.href = "/forms";
    currentForm = ""
}

async function setNextMatchInfo() {
    let nextMatch = await getNextMatchInfo()
    $("#matchNum").val(nextMatch.number)
    $("#teamNum").val(nextMatch.team)
}
setNextMatchInfo()

$('#submitButton').on('click', function (e) {
    submitForm()
});

$(".plus").on('click', function () {
    $(this).prev().children().first().val((parseIntPlus($(this).prev().children().first().val()) ?? 0) + 1);
});

$(".minus").on('click', function () {
    const val = parseIntPlus($(this).next().children().first().val()) ?? 0
    $(this).next().children().first().val(val <= 1 ? 0 : (val - 1));
});

function submitForm() {
    const formData = $('form').serializeArray()
    formData.push({ name: "timestamp", value: formatDate(new Date()) })

    const matchNumber = parseIntPlus($("#matchNum").val())

    $('#submitButton').attr("disabled", "disabled")
    $('#submitButton').html(`<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`)

    let dataPosted: boolean = false;

    postDataGeneral({ 
        action: "postFormData", 
        form: currentForm, 
        data: formData, 
        matchNumber 
    }).then(async function (res) {
        if (res.status == "OK") {
            // dataPosted = true;
            // setTimeout(() => window.location.reload(), 500)
        }
    })

    setTimeout(() => {
        if (!dataPosted) {
            alert("Form could not save! The current data will save to your device and the page will reload. Please try submitting again.")
            saveFormToLocalStorage(formData)
            setTimeout(() => window.location.reload(), 500)
        }
    }, 4000)
}

function formatDate(date: Date) {
    return [date.getMonth(), "/", date.getDate(), "/", date.getFullYear().toString().substring(2), " ", date.getHours(), ":", date.getMinutes(), ":", date.getSeconds()].join("");
}

function saveFormToLocalStorage(formData: JQuery.NameValuePair[] | false) {
    localStorage.setItem(`formData:${currentForm}`, JSON.stringify(formData))
}

function loadFormFromLocalStorage(): boolean {
    const data: JQuery.NameValuePair[] | null | false = JSON.parse(localStorage.getItem(`formData:${currentForm}`) || "null")

    if (data) {
        data.forEach((p) => $(`[name="${p.name}"]`).val(p.value))
        return true;
    } else {
        return false;
    }
}
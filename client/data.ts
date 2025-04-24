import { postDataAdmin } from "./global.js";

const URLParams = new URLSearchParams(window.location.search)

$(".trash").on("click", function(){
    const rowId = parseInt($(this).next().text().trim());
    const uSure = confirm(`Response ID ${rowId} will be deleted!`)
    if (uSure) {
        postDataAdmin({action: "deleteRow", rowId})
        window.location.reload();
    }
})

function sortTable(column: string | null) {
    if (!column) return;

    column = column.trim()

    const params = new URLSearchParams(window.location.search);
    let reverse: boolean = false;

    if (params.get("col") == column) reverse = !(params.get("reverse") === "true")

    params.set("col", column)
    params.set("reverse", String(reverse))
    window.location.search = params.toString();
}

$("th").on('click', function(){
    sortTable($(this).text())
})
import { AdminPostRequest, AdminPostResponse, GeneralPostRequest, GeneralPostResponse, NextMatch } from "../node/types";

export async function postDataAdmin<T extends AdminPostRequest>(data: T) {
    const url = "/admin/"
    console.log(url)
    return fetch(url, {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(async (data) => {
        return await data.json() as AdminPostResponse[T["action"]]
    });
}

export async function postDataGeneral<T extends GeneralPostRequest>(data: T) {
    const url = "/post/"
    console.log(url)
    return fetch(url, {
        method: "POST",
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
        console.log(data)
        return data as GeneralPostResponse[T["action"]]
    });
}

$(document).ready(function () {
    $('#logout-button').on('click', () => {
        logoutUser();
    });
});

function logoutUser() {
    fetch('/logout')
    window.location.reload();
}

export function parseIntPlus(val: string | string[] | number | undefined): number | undefined {
    if (typeof val == "number") return val;
    if (typeof val == "string") return parseInt(val);
    if (typeof val == "undefined") return undefined;
    return parseInt(val.toString());
}

export async function getNextMatchInfo(): Promise<NextMatch> {
    return (await fetch("/user-get/").then((res) => res.json())).nextMatch as NextMatch
}

export function parseStringArray(val: string | string[] | number | undefined): string[] {
    if (typeof val == "object") return val;
    if (typeof val == "number") val = val.toString();
    if (typeof val == "string") {
        val = val.split(",")
        const newValList: string[] = []
        val.forEach((v) => newValList.push(v.trim()))
        return newValList;
    }
    return [];
}
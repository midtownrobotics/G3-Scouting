import { useEffect } from "react";

export function logState(val?: unknown) {
    useEffect(() => {
        console.log(val)
    }, [val])
}

export function alertState(val?: unknown) {
    useEffect(() => {
        alert(val)
    }, [val])
}

export function makeUrlParam(
    name: string, 
    val: string | number | undefined, 
){
    useEffect(() => {
        if (val === undefined) return;
        const url = new URL(window.location.href);
        url.searchParams.set(name, val?.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    }, [val]);
}
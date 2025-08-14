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
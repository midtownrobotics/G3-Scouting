import { useMemo, useState } from "react";

export function useSortableTable<T>(rows: T[]) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(false);
        }
    };

    const sortedRows = useMemo(() => {
        if (!sortKey) return rows;

        return [...rows].sort((a, b) => {
            const aVal = a[sortKey as keyof T];
            const bVal = b[sortKey as keyof T];

            const toNum = (v: any): number => {
                const n = typeof v === "number" ? v : parseFloat(v);
                return isNaN(n) || !isFinite(n) ? 0 : n;
            };

            if (typeof aVal === "string" || typeof bVal === "string") {
                return sortAsc
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            }

            return sortAsc
                ? toNum(aVal) - toNum(bVal)
                : toNum(bVal) - toNum(aVal);
        });
    }, [rows, sortKey, sortAsc]);

    return { sortedRows, sortKey, sortAsc, handleSort };
}

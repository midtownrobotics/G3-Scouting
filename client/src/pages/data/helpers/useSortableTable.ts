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
            const aVal = String(a[sortKey as keyof T]);
            const bVal = String(b[sortKey as keyof T]);

            const parseSpecial = (val: string): { label: string; num: number | null } => {
                const match = val.match(/^(.+?)\s*-\s*(\d+(?:\.\d+)?)%?$/);
                if (match) return { label: match[1].trim(), num: parseFloat(match[2]) };
        
                const num = parseFloat(val);
                return isNaN(num)
                    ? { label: val.trim(), num: null }
                    : { label: "", num };
            };
        
            const aParsed = parseSpecial(aVal);
            const bParsed = parseSpecial(bVal);
        
            // 1. Compare labels
            const labelCompare = aParsed.label.localeCompare(bParsed.label);
            if (labelCompare !== 0) return sortAsc ? labelCompare : -labelCompare;
        
            // 2. Compare numeric part if present
            if (aParsed.num !== null && bParsed.num !== null) {
                return sortAsc ? aParsed.num - bParsed.num : bParsed.num - aParsed.num;
            }
        
            // 3. Fallback to string comparison
            return sortAsc
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });
    }, [rows, sortKey, sortAsc]);

    return { sortedRows, sortKey, sortAsc, handleSort };
}

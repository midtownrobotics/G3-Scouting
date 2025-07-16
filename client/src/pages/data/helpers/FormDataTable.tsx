import { FormRowResponse } from "@shared/schemas/data";
import { Table } from "react-bootstrap";
import { useState } from "react";

export default function FormDataTable({ formRowResponse }: { formRowResponse: FormRowResponse; }) {
    const { questions, rows } = formRowResponse;

    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortAsc(!sortAsc); // Toggle direction
        } else {
            setSortKey(key);
            setSortAsc(false);
        }
    };

    const sortedRows = [...rows].sort((a, b) => {
        if (!sortKey) return 0;
    
        const aVal = a.fieldResponses.find(r => r.question === sortKey)?.response ?? "";
        const bVal = b.fieldResponses.find(r => r.question === sortKey)?.response ?? "";
    
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
    

    return (
        <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Table bordered hover size="sm" className="mb-0">
                <thead className="sticky-top bg-white shadow-sm">
                    <tr>
                        <th />
                        {questions.map((q) => (
                            <th
                                key={q.id}
                                onClick={() => handleSort(q.id)}
                                style={{ cursor: "pointer", whiteSpace: "nowrap", top: 0, zIndex: 2 }}
                            >
                                {q.name}
                                {sortKey === q.id && (sortAsc ? " ▲" : " ▼")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map((row, i) => {
                        const responseMap = new Map(
                            row.fieldResponses.map((r) => [r.question, r.response])
                        );

                        return (
                            <tr key={i}>
                                <th>{i+1}</th>
                                {questions.map((q) => (
                                    <td
                                        key={q.id}
                                        style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}
                                    >
                                        {responseMap.get(q.id) ?? ""}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>

    );
}

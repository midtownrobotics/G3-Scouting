import { useMemo } from "react";
import { SortableTable } from "./SortableTable";
import { useSortableTable } from "./useSortableTable";
import { FormResponseData } from "@shared/schemas/data";

export default function FormResponseTable({ formResponseData }: { formResponseData: FormResponseData; }) {

    const rows = useMemo(() => {
        if (!formResponseData) return [];
        return formResponseData.responses.map(response => {
            const row: { [key: string]: string | number; } = {
                team: response.team,
                match: response.match,
                submittedAt: response.submittedAt ?? "UNKNOWN"
            };
            for (const qr of response.responses) {
                row[qr.question] = qr.response;
            }
            return row;
        });
    }, [formResponseData]);

    const columns = useMemo(() => {
        if (!formResponseData) return [];
        return [
            { label: "Team", key: "team" },
            { label: "Match", key: "match" },
            ...formResponseData.questions.map(q => ({ label: q.name, key: q.id })),
            { label: "Submitted At", key: "submittedAt" },
        ];
    }, [formResponseData]);

    const { sortedRows, sortKey, sortAsc, handleSort } = useSortableTable(rows);

    return (
        <SortableTable
            columns={columns}
            rows={sortedRows}
            sortKey={sortKey}
            sortAsc={sortAsc}
            onSort={handleSort}
            rowKey={(row) => `${row.team}-${row.match}-${row.submittedAt}`}
        />
    );
}
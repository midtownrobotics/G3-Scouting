import { useMemo } from "react";
import { SortableTable } from "./SortableTable";
import { useSortableTable } from "./useSortableTable";
import { FormResponseData } from "@shared/schemas/data";
import { isMatchRelated } from "./utils";

export default function FormResponseTable({ formResponseData }: { formResponseData: FormResponseData; }) {

    const rows = useMemo(() => {
        if (!formResponseData) return [];
        return formResponseData.responses.map(response => {
            const row: { [key: string]: string | number; } = {
                _team: response.team,
                _match: response.match ?? -1,
                _scout: response.userId ?? "",
                _score: response.accuracyScore ?? "",
                _submittedAt: response.submittedAt ?? "UNKNOWN"
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
            { label: "Team", key: "_team" },
            isMatchRelated(formResponseData) ? { label: "Match", key: "_match" } : false,
            { label: "Scout", key: "_scout" },
            isMatchRelated(formResponseData) ? { label: "Accuracy", key: "_score" } : false,
            ...formResponseData.questions.map(q => ({ label: q.name, key: q.id })),
            { label: "Submitted At", key: "_submittedAt" },
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
            rowKey={(row) => `${row._team}-${row._match ?? "NA"}-${row._scout}-${row._submittedAt}`}
        />
    );
}
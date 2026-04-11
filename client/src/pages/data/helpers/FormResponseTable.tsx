import { useEffect, useMemo, useState } from "react";
import { SortableTable } from "./SortableTable";
import { useSortableTable } from "./useSortableTable";
import { FormResponseData } from "@shared/schemas/data";
import { isMatchRelated } from "./utils";
import { getNameFromId } from "../../../utils";

export default function FormResponseTable({ formResponseData }: { formResponseData: FormResponseData; }) {
    useEffect(() => console.log(formResponseData), []);

    const [userNames, setUserNames] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!formResponseData) return;
        const fetchNames = async () => {
            const entries = await Promise.all(
                formResponseData.responses.map(async (response) => {
                    const name = await getNameFromId(response.userId);
                    return [response.userId, name] as const;
                })
            );
            setUserNames(Object.fromEntries(entries));
        };
        fetchNames();
    }, [formResponseData]);

    const rows = useMemo(() => {
        if (!formResponseData) return [];
        return formResponseData.responses.map(response => {
            const row: { [key: string]: string | number; } = {
                _team: response.team,
                _match: response.match ?? -1,
                _scout: userNames[response.userId ?? Infinity] ?? response.userId,
                _score: response.accuracyScore ?? "",
                _submittedAt: response.submittedAt ?? "UNKNOWN"
            };
            for (const qr of response.responses) {
                row[qr.question] = qr.response;
            }
            return row;
        });
    }, [formResponseData, userNames]);

    const columns = useMemo(() => {
        if (!formResponseData) return [];
        return [
            { label: "Team", key: "_team" },
            isMatchRelated(formResponseData) ? { label: "Match", key: "_match" } : false,
            { label: "Scout", key: "_scout" },
            isMatchRelated(formResponseData) ? { label: "%Error", key: "_score" } : false,
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
            rowKey={(row, i) => `${row._team}-${row._match ?? "NA"}-${row._scout}-${row._submittedAt}-${i}`}
        />
    );
}
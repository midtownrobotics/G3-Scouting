import { useEffect, useMemo, useState } from "react";
import { SortableTable } from "../helpers/SortableTable";
import { useSortableTable } from "../helpers/useSortableTable";
import { MultiTeamQuestionData } from "@shared/schemas/data";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import FormIdInput from "../helpers/FormIdInput";

export default function AveragedRows() {
    const [teamQuestionData, setTeamQuestionData] = useState<MultiTeamQuestionData[]>();
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (formId === undefined) return;
        fetchAPIJSON(`/data/getAveragedFormData/${formId}`).then(data => {
            const parsed = z.object({ data: z.array(MultiTeamQuestionData) }).safeParse(data);
            if (parsed.success) setTeamQuestionData(parsed.data.data);
        });
    }, [formId]);

    const { rows, columns } = useMemo(() => {
        const table = new Map<number, { [key: string]: number | string | undefined; }>();
        const columns = [{ key: "team", label: "Team" }];

        for (const { metadata, teamData } of teamQuestionData ?? []) {
            columns.push({ key: metadata.namespaceId, label: metadata.name });
            for (const { team, questionData } of teamData) {
                if (!table.has(team)) table.set(team, { team });
                table.get(team)![metadata.namespaceId] = questionData.average;
            }
        }

        return {
            rows: Array.from(table.values()),
            columns
        };
    }, [teamQuestionData]);

    const { sortedRows, sortKey, sortAsc, handleSort } = useSortableTable(rows);

    if (!teamQuestionData) {
        return (
            <div className="p-3">
                <h1>Team Averages</h1>
                <br />
                <FormIdInput onSubmit={setFormId} />
            </div>
        );
    }

    return (
        <div className="p-3">
            <h1>Team Averages</h1>
            <br />
            <FormIdInput onSubmit={setFormId} />
            <br />
            <SortableTable
                columns={columns}
                rows={sortedRows}
                sortKey={sortKey}
                sortAsc={sortAsc}
                onSort={handleSort}
                rowKey={(row) => row.team!}
            />
        </div>
    );
}

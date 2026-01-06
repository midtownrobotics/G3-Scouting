import { useEffect, useMemo, useState } from "react";
import { SortableTable } from "../helpers/SortableTable";
import { useSortableTable } from "../helpers/useSortableTable";
import { MultiTeamQuestionData } from "@shared/schemas/data";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import FormIdInput from "../helpers/FormIdInput";

export default function AveragedRows({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [teamQuestionData, setTeamQuestionData] = useState<MultiTeamQuestionData[]>();
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (formId === undefined) return;
        fetchAPIJSON(`/data/getQuestionData/${formId}/${accuracy}/${fromMatch}`, z.object({ 
            data: z.array(MultiTeamQuestionData) 
        })).then(res => {
            if (res) setTeamQuestionData(res.data);
        });
    }, [formId, accuracy, fromMatch]);

    const { rows, columns } = useMemo(() => {
        const table = new Map<number, { [key: string]: number | string | undefined; }>();
        const columns = [{ key: "_team", label: "Team" }, { key: "_responsesLength", label: "Responses" }];
        
        for (const { metadata, teamData } of teamQuestionData ?? []) {
            if (metadata.classification === "qualitative") continue;
            columns.push({ key: metadata.namespaceId, label: metadata.name });
            for (const { team, questionData } of teamData) {
                if (!table.has(team)) table.set(team, { "_team" : team, "_responsesLength": questionData.responses.length });
                let average = questionData.average;
                if (typeof average === "number") average = Math.round(average*100)/100
                table.get(team)![metadata.namespaceId] = average;
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
                <FormIdInput onChange={setFormId} />
            </div>
        );
    }

    return (
        <div className="p-3">
            <h1>Team Averages</h1>
            <FormIdInput onChange={setFormId} />
            <br />
            <SortableTable
                columns={columns}
                rows={sortedRows}
                sortKey={sortKey}
                sortAsc={sortAsc}
                onSort={handleSort}
                rowKey={(row) => row["_team"]!}
            />
        </div>
    );
}

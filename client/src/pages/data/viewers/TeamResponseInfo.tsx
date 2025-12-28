import { MultiTeamQuestionData, TeamData } from "@shared/schemas/data";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import { SortableTable } from "../helpers/SortableTable";
import { useSortableTable } from "../helpers/useSortableTable";

export default function TeamResponseInfo({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [data, setData] = useState<MultiTeamQuestionData[]>();
    const [teams, setTeams] = useState<TeamData[]>();

    useEffect(() => {
        fetchAPIJSON(`/data/getAllQuestionData/${accuracy}/${fromMatch}`, z.object({ data: z.array(MultiTeamQuestionData) })).then(res => {
            if (res) setData(res.data);
        });

        fetchAPIJSON("/data/getAllTeams", z.array(TeamData)).then(res => {
            if (res) setTeams(res);
        });
    }, [accuracy, fromMatch]);

    const { rows, columns } = useMemo(() => {
        if (!data || !teams) return { rows: [], columns: [] };

        // Get unique form IDs
        const formIds = [...new Set(data.map(q => q.metadata.formId))].sort();

        // Build a map of team -> formId -> response count
        const responseCountMap = new Map<number, Map<string, number>>();

        // Initialize the map for all teams
        teams.forEach(team => {
            responseCountMap.set(team.number, new Map());
        });

        // Process each question's data
        data.forEach(questionData => {
            const formId = questionData.metadata.formId;

            questionData.teamData.forEach(({ team, questionData: qData }) => {
                const currentCount = responseCountMap.get(team)?.get(formId) || 0;
                const responseCount = qData.responses.length;

                // Keep the maximum response count for this form (in case questions were added later)
                if (responseCount > currentCount) {
                    responseCountMap.get(team)?.set(formId, responseCount);
                }
            });
        });

        // Build columns
        const columns = [
            { key: "_team", label: "Team #" },
            ...formIds.map(formId => ({ key: formId, label: formId }))
        ];

        // Build rows
        const rows = teams.map(team => {
            const row: { [key: string]: number | string } = {
                _team: team.number
            };

            formIds.forEach(formId => {
                row[formId] = responseCountMap.get(team.number)?.get(formId) || 0;
            });

            return row;
        });

        return { rows, columns };
    }, [data, teams]);

    const { sortedRows, sortKey, sortAsc, handleSort } = useSortableTable(rows);

    if (!data || !teams) return <div>Loading...</div>;

    return (
        <div className="mt-4">
            <h2>Number of responses per form per team</h2>
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
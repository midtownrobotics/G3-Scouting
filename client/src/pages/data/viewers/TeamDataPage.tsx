import { TeamRowsResponse } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { z } from "zod";
import FormDataTable from "../helpers/FormDataTable";
import TeamNumberInput from "../helpers/TeamNumberInput";
import { fetchAPIJSON } from "../../../API";

function TeamDataPage({ hideSelector, teamNumber }: { hideSelector?: boolean; teamNumber?: number}) {
    const [teamRowsResponse, setTeamRowsResponse] = useState<TeamRowsResponse>();
    const [team, setTeam] = useState<number>(teamNumber ? teamNumber : parseInt(new URLSearchParams(window.location.search).get("team") ?? "0"));

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getTeamRows/${team}`).then(data => {
            const parsed = z.object({ data: TeamRowsResponse }).safeParse(data);
            if (parsed.success) setTeamRowsResponse(parsed.data.data);
        });
    }, [team]);

    useEffect(() => {
        if (teamNumber !== undefined) {
            setTeam(teamNumber);
        }
    }, [teamNumber]);

    if (!teamRowsResponse || !team) return (
        <div className="p-3">
            <h1>Raw Team Data</h1>
            <br />
            <TeamNumberInput onSubmit={v => setTeam(v)} />
        </div>
    );

    return (
        <div className="p-3">
            {!hideSelector && <>
                <h1>Raw Team Data</h1>
                <br />
                <TeamNumberInput onSubmit={v => setTeam(v)} />
            </>}
            {teamRowsResponse.map((f, i) =>
                <div key={i}>
                    <h3>{f.form}</h3>
                    <FormDataTable formRowResponse={f.responses} />
                </div>
            )}
        </div>
    );
}

export default TeamDataPage;
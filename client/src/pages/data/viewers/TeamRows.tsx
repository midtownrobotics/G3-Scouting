import { useEffect, useState } from "react";
import { z } from "zod";
import TeamNumberInput from "../helpers/TeamNumberInput";
import { fetchAPIJSON } from "../../../API";
import { FormResponseData } from "@shared/schemas/data";
import FormResponseTable from "../helpers/FormResponseTable";

export default function TeamRows({ hideSelector }: { hideSelector?: boolean; }) {
    const [formsResponseData, setFormsResponseData] = useState<FormResponseData[]>();
    const [team, setTeam] = useState<number>(parseInt(new URLSearchParams(window.location.search).get("team") ?? "0"));

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getTeamRows/${team}`).then(data => {
            const parsed = z.object({ data: z.array(FormResponseData) }).safeParse(data);
            if (parsed.success) setFormsResponseData(parsed.data.data);
        });
    }, [team]);

    if (!formsResponseData || !team) return (
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
            {formsResponseData.map(f =>
                <div key={f.formId}>
                    <h3>{f.formId}</h3>
                    <FormResponseTable formResponseData={f} />
                </div>
            )}
        </div>
    );
}
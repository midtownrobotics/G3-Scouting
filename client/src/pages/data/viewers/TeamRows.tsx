import { useEffect, useState } from "react";
import { z } from "zod";
import TeamNumberInput from "../helpers/TeamNumberInput";
import { fetchAPIJSON } from "../../../API";
import { FormResponseData } from "@shared/schemas/data";
import FormResponseTable from "../helpers/FormResponseTable";

export default function TeamRows({ hideSelector, accuracy, fromMatch, toMatch }: { hideSelector?: boolean, accuracy: number, fromMatch: number, toMatch: number; }) {
    const [formsResponseData, setFormsResponseData] = useState<FormResponseData[]>();
    const [team, setTeam] = useState<number>();

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getTeamRows/${team}/${accuracy}/${fromMatch}/${toMatch}`, z.object({
            data: z.array(FormResponseData)
        })).then(res => {
            if (res) setFormsResponseData(res.data);
        });
    }, [team, accuracy, fromMatch, toMatch]);

    if (!formsResponseData || !team) return (
        <div className="p-3">
            <h1>Raw Team Data</h1>
            <br />
            <TeamNumberInput onChange={v => setTeam(v)} queryKey="team" />
        </div>
    );

    return (
        <div className="p-3">
            {!hideSelector && <>
                <h1>Raw Team Data</h1>
                <br />
                <TeamNumberInput onChange={v => setTeam(v)} queryKey="team" />
            </>}
            {formsResponseData.map(f =>
                f.responses.length > 0
                    ? <div key={f.formId} className="mt-3">
                        <h3>{f.formId}</h3>
                        <FormResponseTable formResponseData={f} />
                    </div>
                    : <></>
            )}
        </div>
    );
}
import { PieChart, RadarChart } from "@mui/x-charts";
import { FormResponseData, MiscTeamData, MultiTeamQuestionData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import { numberParser } from "../../../utils";
import TeamNumberInput from "../helpers/TeamNumberInput";
import FormResponseTable from "../helpers/FormResponseTable";
import { getMatchUrl, isMatchRelated } from "../helpers/utils";

export default function TeamSummary({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [data, setData] = useState<MultiTeamQuestionData[]>([]);
    const [fullData, setFullData] = useState<MultiTeamQuestionData[]>([]);
    const [team, setTeam] = useState<number>();
    const [rows, setRows] = useState<FormResponseData[]>([]);
    const [stats, setStats] = useState<MiscTeamData>();

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getTeamRows/${team}/${accuracy}/${fromMatch}`, z.object({
            data: z.array(FormResponseData)
        })).then(res => {
            if (res) setRows(res.data);
        });
    }, [team, accuracy, fromMatch]);

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getMiscTeamData/${team}`, MiscTeamData).then(res => setStats(res));
    }, [team]);

    useEffect(() => {
        fetchAPIJSON(`/data/getAllQuestionData/${accuracy}/${fromMatch}`, z.object({
            data: z.array(MultiTeamQuestionData)
        })).then(res => { if (res) setData(res.data); });
    }, [accuracy, fromMatch]);

    useEffect(() => {
        fetchAPIJSON(`/data/getAllQuestionData`, z.object({
            data: z.array(MultiTeamQuestionData)
        })).then(res => { if (res) setFullData(res.data); });
    }, [])

    const numerical = data.filter(q => q.metadata.type == "number" && q.metadata.classification == "quantitative" && isMatchRelated(q.metadata));
    const multipleChoice = data.filter(q => q.metadata.type == "string" && q.metadata.classification == "quantitative" && isMatchRelated(q.metadata));
    const qualitative = fullData.filter(q => q.metadata.classification == "qualitative" && isMatchRelated(q.metadata));

    const fillRadarChart = true;

    return (
        <div className="p-3">
            <h1>Team Data Summary</h1>
            <TeamNumberInput onChange={setTeam} queryKey="team" />
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <div className="d-flex gap-2">
                            {stats?.avatarBase64 && <img src={`data:image/png;base64,${stats.avatarBase64}`} width={40} height={40} style={{background: "gray"}} />}
                            <h2>{stats?.nickname}</h2>
                        </div>
                        <h4>Team #{team}</h4>
                        <br />
                        <Table style={{width: "25%"}}>
                            <tbody>
                                <tr>
                                    <th>EPA</th>
                                    <td>{stats?.epa}</td>
                                </tr>
                                <tr>
                                    <th>Rank</th>
                                    <td>{stats?.rank}</td>
                                </tr>
                                <tr>
                                    <th>WLT</th>
                                    <td>{stats?.record.wins}-{stats?.record.losses}-{stats?.record.ties}</td>
                                </tr>
                                <tr>
                                    <th>W%</th>
                                    <td>{Math.round((stats?.record.winrate ?? 0) * 100)}%</td>
                                </tr>
                            </tbody>
                        </Table>
                        <br />
                        <h5>
                            {data[0]?.teamData.find(t => t.team == team)?.questionData.responses.length || 0} responses from matches:{" "}
                            {(() => {
                                const responses = data[0]?.teamData.find((t) => t.team === team)?.questionData.responses ?? [];
                                if (responses.length === 0) return "N/A";

                                const counts = responses.reduce<Record<number, number>>((acc, { match }) => {
                                    if (match == null) return acc;
                                    acc[match] = (acc[match] ?? 0) + 1;
                                    return acc;
                                }, {});

                                return Object.entries(counts)
                                    .sort(([a], [b]) => Number(a) - Number(b))
                                    .map(([match, times]) => (
                                        <a key={match} href={getMatchUrl(parseInt(match), accuracy)}>
                                            {match}
                                            {times > 1 && <sup>{times}</sup>}
                                        </a>
                                    ))
                                    .reduce<React.ReactNode[]>((acc, el, idx) => {
                                        if (idx > 0) acc.push(", ");
                                        acc.push(el);
                                        return acc;
                                    }, []);
                            })()}
                        </h5>
                    </Card.Title>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <h1>Skill Chart</h1>
                        <h5>Average per match</h5>
                    </Card.Title>
                    <Card.Text>
                        {(numerical && numerical.length > 0) && <RadarChart
                            style={{ maxWidth: "500px", minHeight: "250px" }}
                            // height={400}
                            series={[
                                {
                                    data: numerical.map(q =>
                                        numberParser(
                                            q.teamData.find(t => t.team === team)?.questionData.average
                                        ) ?? 0
                                    ),
                                    label: team?.toString(),
                                    fillArea: fillRadarChart,
                                    color: "red"
                                },
                                // {
                                //     data: numerical.map(q => q.stats.percentile25 ?? 0),
                                //     label: "25th",
                                //     fillArea: fillRadarChart,
                                //     color: "#050ceb"
                                // },
                                {
                                    data: numerical.map(q => q.stats.percentile50 ?? 0),
                                    label: "50th",
                                    fillArea: fillRadarChart,
                                    color: "#326da8"
                                },
                                {
                                    data: numerical.map(q => q.stats.percentile75 ?? 0),
                                    label: "75th",
                                    fillArea: fillRadarChart,
                                    color: "#3299a8",
                                },
                                // Shows best team
                                // {
                                //     data: numerical.map(q => q.stats.maxAverage?.average ?? 0),
                                //     valueFormatter: (v, c) => (`${Math.round(v * 1000) / 1000} - Team ${numerical[c.dataIndex].stats.maxAverage?.team || 0}`),
                                //     label: "Best",
                                //     fillArea: fillRadarChart,
                                //     color: "#a8a632ff"
                                // }
                            ]}
                            radar={{
                                metrics: numerical.map(q => q.metadata.name)
                            }}
                        />}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <h1>Multiple Choice</h1>
                        <h5>Count of selected</h5>
                    </Card.Title>
                    <Card.Text>
                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            {multipleChoice.map((q, i) => (
                                <div key={i} style={{ flex: "1 1 300px", minWidth: "250px", maxWidth: "300px" }}>
                                    <h5 className="text-center me-5">{q.metadata.name}</h5>
                                    <PieChart
                                        height={200}
                                        series={[
                                            {
                                                data: (() => {
                                                    const responses = q.teamData.find(t => t.team === team)?.questionData.responses;
                                                    if (!responses) return [];
                                                    const counts = responses.reduce<Record<string, number>>((acc, { response }) => {
                                                        acc[response] = (acc[response] ?? 0) + 1;
                                                        return acc;
                                                    }, {});

                                                    return Object.entries(counts).map(([label, value], id) => ({
                                                        id,
                                                        label,
                                                        value,
                                                    }));
                                                })()
                                            }
                                        ]}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h1>Open Ended</h1>
                        <h5>Ignores accuracy</h5>
                    </Card.Title>
                    <Card.Text>
                        {qualitative.map(q => {
                            const responses = q.teamData.find(t => t.team == team)?.questionData.responses
                            if (!responses) return <></>;
                            const hasMatchAssociated = responses.some(r => r.match !== undefined);
                            const empty = responses.filter(r => r.response.trim() === "").length;

                            return (<div>
                                <h3>{q.metadata.formId} - {q.metadata.name}</h3>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Scout</th>
                                            {hasMatchAssociated && <th>Match</th>}
                                            <th>Response</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map(r => <>
                                            {r.response.trim() !== "" && <tr>
                                                <td>{r.scout}</td>
                                                {hasMatchAssociated && <td>{r.match}</td>}
                                                <td>{r.response}</td>
                                            </tr>}
                                        </>)}
                                    </tbody>
                                </Table>
                                {empty > 0 && <h6>(+{empty} blank responses)</h6>}
                            </div>)
                        })}
                    </Card.Text>
                </Card.Body>
            </Card>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h1>Response Rows</h1>
                        <h5>Raw form responses</h5>
                    </Card.Title>
                    <Card.Text>
                        {rows.map(f =>
                            <div key={f.formId}>
                                <h3>{f.formId}</h3>
                                <FormResponseTable formResponseData={f} />
                                <br />
                            </div>
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
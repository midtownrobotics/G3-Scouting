import { PieChart, RadarChart } from "@mui/x-charts";
import { MultiTeamQuestionData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import { numberParser } from "../../../utils";
import TeamNumberInput from "../helpers/TeamNumberInput";

export default function TeamSummary({ accuracy }: { accuracy: number }) {
    const [data, setData] = useState<MultiTeamQuestionData[]>([]);
    const [team, setTeam] = useState<number>();

    useEffect(() => {
        if (team === undefined) return;
        fetchAPIJSON(`/data/getAllQuestionData/${accuracy}`, z.object({
            data: z.array(MultiTeamQuestionData)
        })).then(res => {
            console.log(res)
            if (res) setData(res.data);
        });
    }, [team, accuracy]);

    const numerical = data.filter(q => q.metadata.type == "number" && q.metadata.classification == "quantitative");
    const multipleChoice = data.filter(q => q.metadata.type == "string" && q.metadata.classification == "quantitative");
    const qualitative = data.filter(q => q.metadata.classification == "qualitative");

    const fillRadarChart = true;

    return (
        <div className="p-3">
            <h1>Team Data Summary</h1>
            <TeamNumberInput onChange={v => setTeam(v)} />
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>
                        <h2>Team #{team}</h2>
                        <h2></h2>
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
                                        <span key={match}>
                                            {match}
                                            {times > 1 && <sup>{times}</sup>}
                                        </span>
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
                        <RadarChart
                            width={500}
                            height={400}
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
                                {
                                    data: numerical.map(q => q.stats.percentile25 ?? 0),
                                    label: "25th",
                                    fillArea: fillRadarChart,
                                    color: "#050ceb"
                                },
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
                                    color: "#3299a8"
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
                        />
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
                    <Card.Title>
                        <h1>Open Ended</h1>
                    </Card.Title>
                    <Card.Text>
                        {qualitative.map(q => {
                            const hasMatchAssociated = q.teamData.find(t => t.team == team)?.questionData.responses.some(r => r.match !== undefined);

                            return (<div>
                                <h3>{q.metadata.name}</h3>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Scout</th>
                                            {hasMatchAssociated && <th>Match</th>}
                                            <th>Response</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {q.teamData.find(t => t.team == team)?.questionData.responses.map(r =>
                                            <tr>
                                                <td>{r.scout}</td>
                                                {hasMatchAssociated && <td>{r.match}</td>}
                                                <td>{r.response}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>)
                        })}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
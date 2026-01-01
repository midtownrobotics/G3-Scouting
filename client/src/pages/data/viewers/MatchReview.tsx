import { ExtendedMatchData, FormResponseData, MultiTeamQuestionData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import { numberParser } from "../../../utils";
import FormResponseTable from "../helpers/FormResponseTable";
import MatchNumberInput from "../helpers/MatchNumberInput";
import { getTeamSummaryUrl, isMatchRelated } from "../helpers/utils";

export default function MatchReview({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [data, setData] = useState<MultiTeamQuestionData[]>([]);
    const [matchData, setMatchData] = useState<ExtendedMatchData>();
    const [match, setMatch] = useState<number>();
    const [rows, setRows] = useState<FormResponseData[]>([]);

    const review = matchData?.posted;
    const qualitative = data.filter(q => q.metadata.classification === "qualitative" && isMatchRelated(q.metadata));
    const quantitative = data.filter(q => q.metadata.classification === "quantitative" && isMatchRelated(q.metadata));

    useEffect(() => {
        fetchAPIJSON(`/data/getAllQuestionData/${accuracy}/${fromMatch}`, z.object({
            data: z.array(MultiTeamQuestionData)
        })).then(res => { if (res) setData(res.data); });
    }, [accuracy, fromMatch]);

    useEffect(() => {
        fetchAPIJSON(`/data/getMatchData/${match}`, ExtendedMatchData).then(res => {
            if (res) setMatchData(res);
        });
    }, [match]);

    useEffect(() => {
        if (match === undefined) return;
        fetchAPIJSON(`/data/getMatchRows/${match}/${accuracy}/${fromMatch}`, z.object({
            data: z.array(FormResponseData)
        })).then(res => {
            if (res) setRows(res.data);
        });
    }, [match, accuracy, fromMatch]);

    if (!matchData) return (
        <div className="m-3">
            <h1 className="mb-3">Match Review/Preview</h1>
            <MatchNumberInput onChange={setMatch} />
        </div>
    );

    const formatAverage = (a: string | number | undefined) => {
        if (typeof a !== "number") return a;
        return Math.round(a * 1000) / 1000;
    }
    const totalAverages = (teams: number[], q: MultiTeamQuestionData) => {
        if (q.metadata.type !== "number") return;
        const average = teams.map(t =>
            numberParser(q.teamData.find(d => d.team === t)?.questionData.average)
        ).reduce<number>((a, c) => a + (c ?? 0), 0);

        return Math.round(average * 1000) / 1000;
    }
    const getMatchResponses = (q: MultiTeamQuestionData) => q.teamData.flatMap(t => t.questionData.responses.filter(r => r.match == match).map(r => ({ r, t: t.team })));

    const responsesForCounts = getMatchResponses(data[0]);
    const counts = responsesForCounts.reduce<Record<number, number>>((acc, { t }) => {
        acc[t] = (acc[t] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="m-3">
            <h1 className="mb-3">Match Review/Preview</h1>
            <MatchNumberInput onChange={setMatch} />
            <Card className="mb-3">
                <Card.Body>
                    <Card.Text>
                        <h1>Match {matchData.number} {review ? "Review" : "Preview"}</h1>
                        {matchData?.time && <h4>Played at {matchData.time.toLocaleTimeString()} on {matchData.time.toLocaleDateString()}</h4>}
                        <h3 className="text-primary">{matchData.blue.map(t => <a className="plain-link"  href={getTeamSummaryUrl(t, accuracy)}>{t}<sup>{review && (counts[t] ?? 0)}</sup>  </a>)}</h3>
                        <h3 className="text-danger">{matchData.red.map(t => <a className="plain-link"  href={getTeamSummaryUrl(t, accuracy)}>{t}<sup>{review && (counts[t] ?? 0)}</sup>  </a>)}</h3>
                        {review && <><small>Superscript = responses per team</small><br /></>}
                    </Card.Text>
                </Card.Body>
            </Card>

            {!review && <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h1>Team Average</h1>
                    </Card.Title>
                    <Card.Text>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    {matchData.red.filter(t => counts[t] > 0).map(t =>
                                        <th className="text-danger">
                                            <a className="plain-link"  href={getTeamSummaryUrl(t, accuracy)}>{t}</a>
                                        </th>
                                    )}
                                    <th className="text-danger">Red</th>
                                    <th className="text-primary">Blue</th>
                                    {matchData.blue.filter(t => counts[t] > 0).map(t =>
                                        <th className="text-primary">
                                            <a className="plain-link"  href={getTeamSummaryUrl(t, accuracy)}>{t}</a>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {quantitative.map(q =>
                                    <tr>
                                        <th>{q.metadata.name}</th>
                                        {matchData.red.map(team =>
                                            <td className="text-danger">{formatAverage(q.teamData.find(d => d.team === team)?.questionData.average)}</td>
                                        )}
                                        <td className="text-danger">{totalAverages(matchData.red, q)}</td>
                                        <td className="text-primary">{totalAverages(matchData.blue, q)}</td>
                                        {matchData.blue.map(team =>
                                            <td className="text-primary">{formatAverage(q.teamData.find(d => d.team === team)?.questionData.average)}</td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>}

            {review && <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h1>Recorded Data</h1>
                    </Card.Title>
                    <Card.Text>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    {matchData.teams.filter(t => counts[t] > 0).map(t =>
                                        <th className={matchData.red.includes(t) ? "text-danger" : "text-primary"}>
                                            <a className="plain-link"  href={getTeamSummaryUrl(t, accuracy)}>
                                                {t}
                                            </a>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {quantitative.map(q => {
                                    const allResponses = getMatchResponses(q);
                                    return (<tr>
                                        <td>{q.metadata.name}</td>
                                        {matchData.teams.filter(t => counts[t] > 0).map(team => {
                                            const responses = allResponses.filter(({ t }) => t === team);
                                            const total = q.metadata.type === "number" ? responses.reduce((p, c) => p + (numberParser(c.r.response) ?? 0), 0) : undefined;
                                            const answers = q.metadata.type === "string" ? Array.from(new Set(responses.map(r => r.r.response))) : undefined;

                                            return (<td className={matchData.red.includes(team) ? "text-danger" : "text-primary"}>
                                                {total !== undefined && (Math.round((total ?? 0) / (responses.length) * 100) / 100)}
                                                {answers?.join(", ")}
                                            </td>);
                                        })}
                                    </tr>);
                                })}
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>}

            {review && <Card className="mb-3">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h1>Open Ended</h1>
                        <h5>Ignores accuracy</h5>
                    </Card.Title>
                    <Card.Text>
                        {qualitative?.map(q => {
                            const responses = getMatchResponses(q)
                            if (!responses || responses.length === 0) return <></>;
                            const empty = responses.filter(r => r.r.response.trim() === "").length;

                            return (<div>
                                <h3>{q.metadata.name}</h3>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Team</th>
                                            <th>Scout</th>
                                            <th>Response</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responses.map(r => <>
                                            {r.r.response.trim() !== "" && <tr>
                                                <td className={matchData.red.includes(r.t) ? "text-danger" : "text-primary"}>
                                                    <a className="plain-link"  href={getTeamSummaryUrl(r.t, accuracy)}>
                                                        {r.t}
                                                    </a>
                                                </td>
                                                <td>{r.r.scout}</td>
                                                <td>{r.r.response}</td>
                                            </tr>}
                                        </>)}
                                    </tbody>
                                </Table>
                                {empty > 0 && <h6>(+{empty} blank responses)</h6>}
                            </div>)
                        })}
                    </Card.Text>
                </Card.Body>
            </Card>}

            {review && <Card>
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
                            </div>
                        )}
                    </Card.Text>
                </Card.Body>
            </Card>}
        </div>
    )
}
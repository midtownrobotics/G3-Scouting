import { LineChart } from "@mui/x-charts";
import { QuestionData } from "@shared/schemas/data";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import TeamNumberInput from "../helpers/TeamNumberInput";

function TeamDataCard() {
    const [_, forceUpdate] = useState(0);
    const [questionData, setQuestionData] = useState<QuestionData[]>();
    const questionsLineGraphSelected = useRef(new Map<string, boolean>());
    const [selectedPieGraphQuestion, setSelectedPieGraphQuestion] = useState<string>();
    const [team1, setTeam1] = useState<number>();

    useEffect(() => {
        if (team1 === undefined) return;
        fetchAPIJSON(`/data/getTeamData/${team1}`).then((data) => {
            const parsed = z.object({ data: z.array(QuestionData) }).safeParse(data);
            if (parsed.success) setQuestionData(parsed.data.data);
        });
    }, [team1]);

    if (!questionData) return (
        <div className="p-3">
            <h1>Team Data Summary</h1>
            <br />
            <TeamNumberInput onSubmit={v => setTeam1(v)} />
        </div>
    );

    const averageableQuestions = questionData.filter((q) => q.average !== undefined);
    const pieGraphableQuestions = questionData.filter(
        (q) => q.questionMeta.classification == "quantitative" && q.questionMeta.type == "string"
    );
    const lineGraphableQuestions = questionData.filter(
        (q) => q.questionMeta.classification == "quantitative" && q.questionMeta.type == "number"
    );
    const lineGraphSelectedQuestions = questionData
        .filter((q) => questionsLineGraphSelected.current.get(q.questionFormId))
        .map((q) => {
            const grouped = q.responses.reduce((acc, curr) => {
                const key = curr.matchNumber;
                if (!acc.has(key)) acc.set(key, []);
                acc.get(key)!.push(parseFloat(curr.response));
                return acc;
            }, new Map<number, number[]>());

            const averagedResponses = Array.from(grouped.entries()).map(([matchNumber, values]) => {
                const avg = values.reduce((a, b) => a + b, 0) / values.length;
                return { matchNumber, response: avg.toFixed(2) };
            });

            averagedResponses.sort((a, b) => b.matchNumber - a.matchNumber);

            return { ...q, responses: averagedResponses };
        });

    const lineGraphMatchNumbers = Array.from(
        new Set(lineGraphSelectedQuestions.flatMap((q) => q.responses.map((r) => r.matchNumber)))
    ).sort((a, b) => a - b);

    const pieGraphQuestion = pieGraphableQuestions.find((q) => q.questionFormId == selectedPieGraphQuestion);
    const pieGraphResponses = pieGraphQuestion?.responses.sort((a, b) => a.matchNumber - b.matchNumber);
    const qualitativeQuestions = questionData.filter(
        (q) => q.questionMeta.classification == "qualitative" && q.questionId !== "UserId" && q.questionId !== "SubmittedAt"
    );

    return (
        <div className="p-3">
            <TeamNumberInput onSubmit={v => setTeam1(v)} />
            <h2 className="mb-4">Team {team1} Summary</h2>

            <Card className="mb-4">
                <Card.Header as="h5">Averages</Card.Header>
                <Card.Body>
                    <Table bordered responsive size="sm" className="text-center">
                        <thead>
                            <tr>
                                {averageableQuestions.map((q, i) => <th key={i}>{q.questionMeta.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {averageableQuestions.map((q, i) => <td key={i}>{q.average}</td>)}
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header as="h5">Line Graphs</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        {lineGraphableQuestions.map((q, i) => (
                            <Col xs={6} md={4} lg={3} key={i}>
                                <Form.Check
                                    type="checkbox"
                                    id={`lgqs-${i}`}
                                    label={q.questionMeta.name}
                                    checked={questionsLineGraphSelected.current.get(q.questionFormId) ?? false}
                                    onChange={() => {
                                        const current = questionsLineGraphSelected.current.get(q.questionFormId) ?? false;
                                        questionsLineGraphSelected.current.set(q.questionFormId, !current);
                                        forceUpdate((x) => x + 1);
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>

                    <div className="bg-light rounded p-3">
                        <LineChart
                            height={300}
                            xAxis={[{ data: lineGraphMatchNumbers, label: "Match" }]}
                            series={lineGraphSelectedQuestions.map((q) => ({
                                label: q.questionMeta.name,
                                data: lineGraphMatchNumbers.map((matchNumber) => {
                                    const res = q.responses.find((r) => r.matchNumber === matchNumber);
                                    return res ? parseFloat(res.response) : null;
                                }),
                            }))}
                        />
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header as="h5">Multiselect Responses</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        {pieGraphableQuestions.map((q, i) => (
                            <Col xs={12} md={6} lg={4} key={i}>
                                <Form.Check
                                    type="radio"
                                    name="pie-question"
                                    id={`pgqs-${i}`}
                                    label={q.questionMeta.name}
                                    checked={selectedPieGraphQuestion === q.questionFormId}
                                    onChange={() => setSelectedPieGraphQuestion(
                                        selectedPieGraphQuestion === q.questionFormId ? undefined : q.questionFormId
                                    )}
                                />
                            </Col>
                        ))}
                    </Row>

                    {pieGraphResponses && (() => {
                        const grouped = new Map<number, string[]>();
                        pieGraphResponses.forEach((r) => {
                            if (!grouped.has(r.matchNumber)) grouped.set(r.matchNumber, []);
                            grouped.get(r.matchNumber)!.push(r.response);
                        });

                        const matchNumbers = Array.from(grouped.keys()).sort((a, b) => a - b);
                        const maxRows = Math.max(...Array.from(grouped.values()).map((r) => r.length));
                        const rows = [];

                        for (let i = 0; i < maxRows; i++) {
                            rows.push(
                                <tr key={i}>
                                    <th>{i === 0 ? "Value" : ""}</th>
                                    {matchNumbers.map((mn) => {
                                        const values = grouped.get(mn)!;
                                        return <td key={mn + "-" + i}>{values[i] ?? ""}</td>;
                                    })}
                                </tr>
                            );
                        }

                        return (
                            <Table bordered responsive size="sm" className="text-center align-middle">
                                <thead>
                                    <tr>
                                        <th>Match</th>
                                        {matchNumbers.map((mn) => <th key={mn}>{mn}</th>)}
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
                        );
                    })()}
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header as="h5">Qualitative Notes</Card.Header>
                <Card.Body>
                    {qualitativeQuestions.map((q, i) => (
                        <div className="mb-3" key={i}>
                            <h6 className="fw-bold">{q.questionMeta.name}</h6>
                            {q.responses.map((r, j) => (
                                <p className="mb-1" key={j}><strong>{r.matchNumber}:</strong> {r.response}</p>
                            ))}
                        </div>
                    ))}
                </Card.Body>
            </Card>
        </div>
    );
}

export default TeamDataCard;

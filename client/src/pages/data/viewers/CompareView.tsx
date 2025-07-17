import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import TeamDataSummary from './TeamDataSummary';
import { useEffect, useRef, useState } from 'react';
import { fetchAPIJSON } from '../../../API';
import {z} from "zod";
import { QuestionData } from '@shared/schemas/data';
import { RadarChart } from '@mui/x-charts';

export default function CompareView() {
    const [_, forceUpdate] = useState(0);
    const [teamNumberLeft, setTeamNumberLeft] = useState<number | undefined>();
    const [teamNumberRight, setTeamNumberRight] = useState<number | undefined>();
    const [questionDataLeft, setQuestionDataLeft] = useState<QuestionData[]>();
    const [questionDataRight, setQuestionDataRight] = useState<QuestionData[]>();
    const questionsSkillChartSelected = useRef(new Map<string, boolean>());

    useEffect(() => {
        const teamLeft = new URLSearchParams(window.location.search).get("team");
        const teamRight = new URLSearchParams(window.location.search).get("team2");

        if (teamLeft && !Number.isNaN(parseInt(teamLeft))) setTeamNumberLeft(parseInt(teamLeft));
        if (teamRight && !Number.isNaN(parseInt(teamRight))) setTeamNumberRight(parseInt(teamRight));

    }, []);
    
    useEffect(() => {
        if (teamNumberLeft === undefined) return;
        fetchAPIJSON(`/data/getTeamData/${teamNumberLeft}`).then((data) => {
            const parsed = z.object({ data: z.array(QuestionData) }).safeParse(data);
            if (parsed.success) setQuestionDataLeft(parsed.data.data);
        }
        );
        console.log(teamNumberLeft)
    }, [teamNumberLeft]);

    
    useEffect(() => {
        if (teamNumberRight === undefined) return;
        fetchAPIJSON(`/data/getTeamData/${teamNumberRight}`).then((data) => {
            const parsed = z.object({ data: z.array(QuestionData) }).safeParse(data);
            if (parsed.success) setQuestionDataRight(parsed.data.data);
        }
        );
        console.log(teamNumberRight)
    }, [teamNumberRight]);


    if (questionDataLeft === undefined || questionDataRight === undefined) return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                <Col md={6} className="scroll-panel left-panel">
                    <TeamDataSummary displayTeamNumberInputOnly={questionDataLeft === undefined} sendTeamNumber={setTeamNumberLeft}/>
                </Col>
                <Col md={6} className="scroll-panel right-panel">
                    <TeamDataSummary displayTeamNumberInputOnly={questionDataRight === undefined} second sendTeamNumber={setTeamNumberRight}/>
                </Col>
            </Row>
        </Container>
    )

    const skillChartableQuestionsLeft = questionDataLeft.filter((q) => q.average !== undefined && q.questionMeta.classification == "quantitative" && q.questionMeta.type == "number");
    const skillChartableQuestionsRight = questionDataRight.filter((q) => q.average !== undefined && q.questionMeta.classification == "quantitative" && q.questionMeta.type == "number");

    const skillChartSelectedQuestionsLeft = skillChartableQuestionsLeft.filter(q => questionsSkillChartSelected.current.get(q.questionFormId));
    const skillChartSelectedQuestionsRight = skillChartableQuestionsRight.filter(q => questionsSkillChartSelected.current.get(q.questionFormId));

    return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                <Col md={6} className="scroll-panel left-panel">
                    <h1>{teamNumberLeft}</h1>
                    <TeamDataSummary sendTeamNumber={setTeamNumberLeft}/>
                </Col>
                <Col md={6} className="scroll-panel right-panel">
                    <h1>{teamNumberRight}</h1>
                    <TeamDataSummary second sendTeamNumber={setTeamNumberRight}/>
                </Col>
            </Row>
            <Card className="mb-4">
                            <Card.Header as="h5">Skill Graph</Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    {skillChartableQuestionsLeft.map((q, i) => (
                                        <Col xs={6} md={4} lg={3} key={i}>
                                            <Form.Check
                                                type="checkbox"
                                                id={`skqs-${i}`}
                                                label={q.questionMeta.name}
                                                checked={questionsSkillChartSelected.current.get(q.questionFormId) ?? false}
                                                onChange={() => {
                                                    const current = questionsSkillChartSelected.current.get(q.questionFormId) ?? false;
                                                    questionsSkillChartSelected.current.set(q.questionFormId, !current);
                                                    forceUpdate((x) => x + 1);
                                                }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
            
                                {skillChartSelectedQuestionsLeft.length >= 3 &&
                                    <div className="bg-light rounded p-3">
                                        <RadarChart
                                            height={300}
                                            series={[{ label: teamNumberLeft?.toString(), data: skillChartSelectedQuestionsLeft.map(q => parseFloat(q.average ?? "0")) },
                                                     { label: teamNumberRight?.toString(), data: skillChartSelectedQuestionsRight.map(q => parseFloat(q.average ?? "0"))}
                                            ]}
                                            radar={{
                                                max: 120,
                                                metrics: skillChartSelectedQuestionsLeft.map(q => ({ name: q.questionMeta.name, max: Math.ceil((parseInt(q.average ?? "0") + 1) / 2) * 2 })),
                                            }}
                                        />
                                    </div>
                                }
                            </Card.Body>
                        </Card>
        </Container>
    );
};
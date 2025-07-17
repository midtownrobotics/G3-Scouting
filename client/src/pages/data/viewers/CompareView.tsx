import { Container, Row, Col } from 'react-bootstrap';
import TeamDataSummary from './TeamDataSummary';
import { useEffect, useState } from 'react';
import { fetchAPIJSON } from '../../../API';
import {z} from "zod";
import { QuestionData } from '@shared/schemas/data';

export default function CompareView() {
    const [teamNumberLeft, setTeamNumberLeft] = useState(0);
    const [teamNumberRight, setTeamNumberRight] = useState(0);
    const [questionDataLeft, setQuestionDataLeft] = useState<QuestionData[]>();
    const [questionDataRight, setQuestionDataRight] = useState<QuestionData[]>();

    useEffect(() => {
        if (teamNumberLeft === undefined) return;
        fetchAPIJSON(`/data/getTeamData/${teamNumberLeft}`).then((data) => {
            const parsed = z.object({ data: z.array(QuestionData) }).safeParse(data);
            if (parsed.success) setQuestionDataLeft(parsed.data.data);
        }
        );
    }, [teamNumberLeft]);

    
    useEffect(() => {
        if (teamNumberRight === undefined) return;
        fetchAPIJSON(`/data/getTeamData/${teamNumberRight}`).then((data) => {
            const parsed = z.object({ data: z.array(QuestionData) }).safeParse(data);
            if (parsed.success) setQuestionDataRight(parsed.data.data);
        }
        );
    }, [teamNumberRight]);

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
        </Container>
    );
};
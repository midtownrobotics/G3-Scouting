import { Container, Row, Col } from 'react-bootstrap';
import TeamDataSummary from './TeamDataSummary';
import { useState } from 'react';

export default function CompareView() {
    const [teamNumberLeft, setTeamNumberLeft] = useState(0)
    const [teamNumberRight, setTeamNumberRight] = useState(0)


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
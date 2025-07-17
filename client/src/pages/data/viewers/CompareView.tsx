import { Container, Row, Col } from 'react-bootstrap';
import TeamDataSummary from './TeamDataSummary';

export default function CompareView() {
    return (
        <Container fluid className="p-0">
            <Row className="g-0 h-100">
                <Col md={6} className="scroll-panel left-panel">
                    <TeamDataSummary />
                </Col>
                <Col md={6} className="scroll-panel right-panel">
                    <TeamDataSummary />
                </Col>
            </Row>
        </Container>
    );
};
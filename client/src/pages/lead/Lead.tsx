import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row, Col, Spinner, Table } from "react-bootstrap";
import { fetchAPIJSON, postAPI } from "../../API";
import { z } from "zod";
import { CurrentAssignment, MatchData } from "@shared/schemas/data";

export default function Lead() {
    const [currentMatch, setCurrentMatch] = useState(-1);
    const [matchInput, setMatchInput] = useState(-1);
    const [assignments, setAssignments] = useState<CurrentAssignment[]>();

    const getMatchData = () => {
        fetchAPIJSON("/getCurrentMatch", MatchData).then(res => {
            if (res) {
                setCurrentMatch(res.number);
                setMatchInput(res.number + 1);
                return;
            }
            setTimeout(getMatchData, 500);
        });

        fetchAPIJSON("/lead/getCurrentAssignment", z.object({ 
            assignments: z.array(CurrentAssignment) 
        })).then(res => {
            if (res) {
                setAssignments(res.assignments);
                return;
            }
            setTimeout(getMatchData, 500);
        });
    };

    useEffect(getMatchData, []);

    const handleSetMatch = async () => {
        setCurrentMatch(-1);
        await postAPI("/lead/assignForMatch", { match: matchInput });
        getMatchData();
    };

    return (
        <Container className="mt-4" style={{ maxWidth: "600px" }}>
            <h1 className="mb-4">Scout Lead Page</h1>

            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title>Current Match: {currentMatch === -1 ? <Spinner size="sm" /> : currentMatch}</Card.Title>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSetMatch();
                        }}
                    >
                        <Row className="align-items-center mt-3 g-2">
                            <Col xs="auto">
                                <Form.Control
                                    type="number"
                                    value={matchInput}
                                    onChange={(e) => setMatchInput(parseInt(e.target.value))}
                                    min={1}
                                    style={{ width: "100px" }}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button variant="primary" type="submit" disabled={currentMatch === -1}>
                                    Set Match
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Body>
                    <Card.Title>
                        Current Assignments
                    </Card.Title>
                    <Table striped style={{ display: assignments === undefined ? "none" : "block" }}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Team</th>
                                <th>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments?.map(a =>
                                <tr>
                                    <td>{a.username}</td>
                                    <td>{a.team}</td>
                                    <td><input type={"checkbox"} disabled checked={a.finished} /></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

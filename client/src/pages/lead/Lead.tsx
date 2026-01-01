import { CurrentAssignment, MatchData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { Button, Card, Col, Collapse, Container, Form, FormSelect, Row, Spinner, Table } from "react-bootstrap";
import { ArrowClockwise, CaretDownSquareFill, CaretUpSquareFill } from "react-bootstrap-icons";
import { z } from "zod";
import { fetchAPIJSON, postAPI } from "../../API";

export default function Lead() {
    const [currentMatch, setCurrentMatch] = useState(-1);
    const [matchInput, setMatchInput] = useState(-1);
    const [assignments, setAssignments] = useState<CurrentAssignment[]>();
    const [spin, setSpin] = useState(false);
    const [currentAssignmentsOpen, setCurrentAssignmentsOpen] = useState(true);

    const [msg, setMsg] = useState("");
    const [msgExpires, setMsgExpires] = useState("");
    const [msgSendDisabled, setMsgSendDisabled] = useState(false);

    const getMatchData = () => {
        fetchAPIJSON("/getCurrentMatch", MatchData).then(res => {
            if (res) {
                setCurrentMatch(res.number);
                setMatchInput(res.number + 1);
                return;
            }
        });

        fetchAPIJSON("/lead/getCurrentAssignment", z.object({
            assignments: z.array(CurrentAssignment)
        })).then(res => {
            if (res) {
                setAssignments(res.assignments);
                return;
            }
        });
    };

    useEffect(getMatchData, []);

    const reload = async () => {
        getMatchData();
        setSpin(true);
        setTimeout(() => setSpin(false), 1000);
    }

    const handleSetMatch = async () => {
        setCurrentMatch(-1);
        await postAPI("/lead/assignForMatch", { match: matchInput });
        getMatchData();
    };

    const sendNotification = async () => {
        if (!msg || !msgExpires) return;
        setMsgSendDisabled(true);
        await postAPI("/lead/sendNotification", { msg, expires: Date.now() + parseInt(msgExpires) }).then(() => setMsgSendDisabled(false));
    };

    return (
        <Container className="mt-4" style={{ maxWidth: "600px" }}>
            <h1 className="mb-4">Scout Lead Page</h1>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title>Broadcast Notification</Card.Title>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendNotification();
                        }}
                    >
                        <Row className="align-items-center mt-3 g-2">
                            <Col xs="auto">
                                <Form.Control
                                    type="text"
                                    value={msg}
                                    placeholder="Message..."
                                    onChange={(e) => setMsg(e.target.value)}
                                    style={{ width: "200px" }}
                                />
                            </Col>
                            <Col xs="auto">
                                <FormSelect
                                    onChange={(e) => setMsgExpires(e.target.value)}
                                    value={msgExpires}
                                >
                                    <option value={""}>Expires in...</option>
                                    <option value={"15000"}>15sec</option>
                                    <option value={"30000"}>30sec</option>
                                    <option value={"60000"}>1min</option>
                                    <option value={"120000"}>2min</option>
                                    <option value={"300000"}>5min</option>
                                    <option value={"600000"}>10min</option>
                                </FormSelect>
                            </Col>
                            <Col xs="auto">
                                <Button variant="success" type="submit" disabled={msgSendDisabled}>
                                    Send
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>

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
                                <Button variant="success" type="submit" disabled={currentMatch === -1}>
                                    Set Match
                                </Button>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Body>
                    <Card.Title className="d-flex align-items-center ">
                        Current Assignments
                        <Button variant="link" className="text-dark px-2" onClick={() => setCurrentAssignmentsOpen(!currentAssignmentsOpen)}>
                            {currentAssignmentsOpen ? <CaretUpSquareFill size={20} /> : <CaretDownSquareFill size={20} />}
                        </Button>
                        <Button variant="link" className="text-dark px-0" onClick={reload}>
                            <ArrowClockwise className={spin ? "spin-once" : ""} size={20} />
                        </Button>
                    </Card.Title>
                    <Collapse in={currentAssignmentsOpen && assignments !== undefined}>
                        <div>
                            <Table
                                striped
                                style={{ textAlign: "center" }}
                                className="w-100"
                            >
                                <thead className="w-100">
                                    <tr>
                                        <th colSpan={1}>User</th>
                                        <th>Team</th>
                                        <th>Submitted</th>
                                    </tr>
                                </thead>
                                <tbody className="w-100">
                                    {assignments?.map(a =>
                                        <tr key={a.username}>
                                            <td>{a.displayName || a.username}</td>
                                            <td>{a.team}</td>
                                            <td className="user-select-none text-center">
                                                <input type={"checkbox"} checked={a.finished} readOnly />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Collapse>
                </Card.Body>
            </Card>
        </Container>
    );
}

import { Assignment, UserScheduleData } from "@shared/schemas/schedule";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";
import { fetchAPIJSON } from "../API";
import { toFormattedTime } from "./scheduler/utils";
import { getCurrentBlockId } from "@shared/utils";
import { softenColor } from "./home/utils";
import { getAssignmentDuration, getCurrentBlockMins } from "../utils";

function getMinutesSinceMidnight() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const totalMinutes = (hours * 60) + minutes;
    return totalMinutes;
}

export default function ShiftTracker() {
    const [assignments, setAssignments] = useState<Assignment[]>();
    const [schedules, setSchedules] = useState<UserScheduleData[]>();
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment>();

    const currentSchedules = schedules?.filter(s => s.current !== undefined && s.current.id === selectedAssignment?.id);
    const upcoming = schedules?.map(s =>
        s.schedule.some(a =>
            a.block.id === getCurrentBlockId(1) &&
            a.assignment.id === selectedAssignment?.id
        ) && (s.current === undefined || s.current.id !== selectedAssignment?.id)
            ? s.name
            : undefined
    ).filter(n => n !== undefined);

    useEffect(() => {
        fetchAPIJSON("/assignments", Assignment.array()).then(res => {
            if (res) {
                setAssignments(res);
                setSelectedAssignment(res[0]);
            }
        });

        fetchAPIJSON("/schedules", UserScheduleData.array()).then(res => {
            if (res) {
                setSchedules(res);
            }
        });
    }, []);

    return (
        <Container fluid className="py-4 min-vh-100">
            {/* Header */}
            <div className="mb-4">
                <h2 className="mb-2 fw-bold">Shift Tracker</h2>
                <Form.Select
                    style={{
                        width: "220px",
                        backgroundColor: softenColor(selectedAssignment?.color),
                        borderColor: selectedAssignment?.color,
                        boxShadow: "none"
                    }}
                    value={selectedAssignment?.id ?? ""}
                    onChange={(e) => setSelectedAssignment(assignments?.find(a => a.id === parseInt(e.target.value)))}
                >
                    {assignments?.map((a) => (
                        <option key={a.id} value={a.id} style={{ backgroundColor: "white" }}>
                            {a.name}
                        </option>
                    ))}
                </Form.Select>
            </div>

            {(currentSchedules && currentSchedules.length > 0) ? (
                <div>
                    <h2 className="m-3">Current: </h2>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {
                            currentSchedules?.map((s, idx) => {
                                const minsLeft = getAssignmentDuration(s.current, s.schedule);
                                if (minsLeft === null) return <></>;

                                let timeColor = "success";
                                if (minsLeft <= 30) timeColor = "warning";
                                if (minsLeft <= 10) timeColor = "danger";

                                return (
                                    <Col key={idx}>
                                        <Card className="shadow-sm h-100 rounded-4 hover-card" style={{backgroundColor: "rgb(238, 238, 238)"}}>
                                            <Card.Body className="d-flex flex-column align-items-center text-center">
                                                <Card.Title className="fw-semibold">{s.name}</Card.Title>
                                                <Card.Text className="text-muted d-flex align-items-center">
                                                    <Clock className="me-2" />
                                                    Ends at {toFormattedTime(getMinutesSinceMidnight() + minsLeft)}
                                                </Card.Text>
                                                <Badge bg={timeColor} pill>
                                                    {minsLeft > 0 ? `${minsLeft} min left` : "Ended"}
                                                </Badge>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            ) : (
                <div>
                    <h3 className="m-4">There are no currently assigned users.</h3>
                </div>
            )}

            {(upcoming && upcoming.length > 0) && (
                <div>
                    <h2 className="m-3">Upcoming: </h2>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {
                            upcoming?.map((name, idx) => {
                                if (name === undefined) return <></>;

                                return (
                                    <Col key={idx}>
                                        <Card className="shadow-sm h-100 border-0 rounded-4 hover-card">
                                            <Card.Body className="d-flex flex-column align-items-center text-center">
                                                <Card.Title className="fw-semibold">{name}</Card.Title>
                                                <Card.Text className="text-muted d-flex align-items-center">
                                                    <Clock className="me-2" />
                                                    Starts at {toFormattedTime(getCurrentBlockMins() + 30)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                    </Row>
                </div>
            )}
        </Container>
    );
}
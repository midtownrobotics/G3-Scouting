import React, { useState } from "react";
import { Card, Container, Spinner, Table } from "react-bootstrap";
import { useUserData } from "../../userData";
import { getCurrentBlockMins, getCurrentDate } from "../../utils";
import { toFormattedTime } from "../scheduler/utils";
import { condenseSchedule, getFormattedAssignmentDuration, getFormattedDate, makeDateFromDateString, softenColor } from "./utils";
import { Alliance } from "@shared/utils";

function Home() {
    const { userData } = useUserData();

    const [notifications, setNotifications] = useState(5);

    return !userData ? (
        <Container style={{ textAlign: "center" }}>
            <Spinner style={{ width: "3rem", height: "3rem" }} />
        </Container>
    ) : (
        <Container className="mt-4" id="home-page">
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Welcome back, {userData?.user.displayName ?? userData.user.username}!</Card.Title>
                    <Card.Text>
                        <p className="mb-0">You have <b>{Math.round(userData.user.tokens * 100) / 100}</b> BoyleBucks and <b>{Math.round(userData.user.xp * 100) / 100}</b> XP.</p>
                        {userData?.currentAssignment && <p className="mt-1">You're current assignment is: {userData?.currentAssignment?.name}. You will be on this assignment for {getFormattedAssignmentDuration(userData.currentAssignment, userData.user.schedule)}.</p>}
                    </Card.Text>
                </Card.Body>
            </Card>

            {userData.notifications.length > 0 && <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Notifications</Card.Title>
                    {userData.notifications.filter((_, i) => i < notifications).map(n =>
                        <div>
                            <i>{getFormattedDate(new Date(n.sentAt))}</i>
                            <span> - {n.message}</span>
                        </div>
                    )}
                    <span
                        onClick={() => setNotifications(5)}
                        className="text-decoration-underline text-primary cursor-pointer"
                        hidden={notifications == 5}
                    >Show Less</span>
                    <span
                        hidden={notifications == 5 || notifications >= userData.notifications.length}
                    >&nbsp;|&nbsp;</span>
                    <span
                        onClick={() => setNotifications(notifications + 5)}
                        className="text-decoration-underline text-primary cursor-pointer"
                        hidden={notifications >= userData.notifications.length}
                    >Show More</span>
                </Card.Body>
            </Card>}

            <Card className="shadow-sm">
                <Card.Header>Your Schedule</Card.Header>
                <Card.Body className="p-0">
                    <Table bordered responsive className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Assignment</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Alliance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData?.user.schedule.length === 0 || !userData ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-3 text-muted">
                                        No assignments yet.
                                    </td>
                                </tr>
                            ) : (
                                condenseSchedule(userData)
                                    .filter(b =>
                                        !(
                                            b.date < getCurrentDate() || // b.date is before today
                                            (b.date === getCurrentDate() && b.endTime < getCurrentBlockMins()) // today, but already passed
                                        )
                                    )
                                    .map((item, index, schedule) => {

                                        return (
                                            <React.Fragment key={item.blockIds.join("-")}>
                                                {(index === 0 || item.date !== schedule[index - 1]?.date) && (
                                                    <tr key={`date-${item.date}`}>
                                                        <td colSpan={4} style={{ textAlign: "center" }}>
                                                            {makeDateFromDateString(item.date).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <td style={{ backgroundColor: softenColor(item.assignmentColor) }}>
                                                        {item.assignmentName}
                                                    </td>
                                                    <td style={{ backgroundColor: softenColor(item.assignmentColor) }}>
                                                        {toFormattedTime(item.startTime)}
                                                    </td>
                                                    <td style={{ backgroundColor: softenColor(item.assignmentColor) }}>
                                                        {toFormattedTime(item.endTime + 30)}
                                                    </td>
                                                    {item.alliance == undefined ?
                                                        <td style={{ backgroundColor: softenColor(item.assignmentColor) }}>--</td> :
                                                        <td style={{ backgroundColor: softenColor(item.alliance == Alliance.RED ? "#ff0000" : "#0000ff") }}>
                                                            {item.alliance}
                                                        </td>
                                                    }
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;
import { UserInformation } from "@shared/schemas/user";
import React, { useEffect, useState } from "react";
import { Card, Container, Spinner, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../API";
import { toFormattedTime } from "../admin/scheduler/utils";
import { compareBlocksByDate, condenseSchedule, getCurrentBlockMins, getCurrentDate, getFormattedAssignmentDuration, makeDateFromDateString, softenColor } from "./utils";

function Home() {
    const [userData, setUserData] = useState<UserInformation>()

    useEffect(() => {
        fetchAPIJSON("/me").then(res => {
            const body = UserInformation.safeParse(res)
            if (body.data && body.success) {
                body.data.user.schedule = body.data.user.schedule.sort((a, b) => a.block.time - b.block.time)
                body.data.user.schedule = body.data.user.schedule.sort((a, b) => compareBlocksByDate(a.block, b.block))
                setUserData(body.data);
            }
        })
    }, [])

    return !userData ? (
        <Container style={{ textAlign: "center" }}>
            <Spinner style={{ width: "3rem", height: "3rem" }} />
        </Container>
    ) : (
        <Container className="mt-4" id="home-page">
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Welcome back, {userData?.user.username}!</Card.Title>
                    {userData?.currentAssignment && <Card.Text>You're current assignment is: {userData?.currentAssignment?.name}. You will be on this assignment for {getFormattedAssignmentDuration(userData.currentAssignment, userData.user.schedule)}.</Card.Text>}
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header>Your Schedule</Card.Header>
                <Card.Body className="p-0">
                    <Table bordered responsive className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Assignment</th>
                                <th>Start Time</th>
                                <th>End Time</th>
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
                                                        <td colSpan={3} style={{ textAlign: "center" }}>
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
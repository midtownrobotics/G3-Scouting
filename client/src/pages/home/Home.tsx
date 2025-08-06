import { UserInformation } from "@shared/schemas/user";
import React, { useEffect, useState } from "react";
import { Card, Container, Spinner, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../API";
import { toFormattedTime } from "../admin/scheduler/utils";
import { compareBlocksByDate, condenseSchedule, getCurrentBlockMins, getCurrentDate, makeDateFromDateString, softenColor } from "./utils";

function Home() {
    const [userData, setUserData] = useState<UserInformation>()

    function getCurrentAssignmentDuration(): string | null {
        if (!userData || !userData.currentAssignment) return null;

        const { schedule } = userData.user;
        const currentTime = getCurrentBlockMins();
        const now = new Date();
        const currentDate = getCurrentDate();
        const currentAssignmentId = userData.currentAssignment.id;

        const currentIndex = schedule.findIndex(
            (a) =>
                a.block.time === currentTime &&
                a.block.date === currentDate
        );

        if (currentIndex === -1) return null;

        let endTime = schedule[currentIndex].block.time;

        // Walk forward to find the last matching block time
        for (let i = currentIndex + 1; i < schedule.length; i++) {
            const prev = schedule[i - 1];
            const curr = schedule[i];

            if (
                curr.assignment.id === currentAssignmentId &&
                curr.block.date === prev.block.date &&
                curr.block.time === prev.block.time + 30
            ) {
                endTime = curr.block.time;
            } else {
                break;
            }
        }

        // Convert current real time to minutes since midnight
        const realNowMinutes = now.getHours() * 60 + now.getMinutes();

        const remainingMinutes = Math.max(0, endTime + 30 - realNowMinutes);

        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;

        if (minutes == 0) {
            return `${hours} more hours`
        }

        if (hours > 0) {
            return `${hours}hour${hours !== 1 ? "s" : ""}${minutes ? ` ${minutes} more minute${minutes !== 1 ? "s" : ""}` : ""}`;
        }

        return `${minutes} more minute${minutes !== 1 ? "s" : ""}`
    }

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
                    {userData?.currentAssignment && <Card.Text>You're current assignment is: {userData?.currentAssignment?.name}. You will be on this assignment for {getCurrentAssignmentDuration()}.</Card.Text>}
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
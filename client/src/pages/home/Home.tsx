import { UserInformation } from "@shared/schemas/API";
import { useEffect, useState } from "react";
import { Card, Container, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../API";
import { toFormattedTime } from "../admin/scheduler/utils";
import { compareBlocksByDate, getCurrentDate, getCurrentTimeMins, softenColor } from "./utils";
import { Block } from "@shared/schemas/schedule";

function Home() {
    const [userData, setUserData] = useState<UserInformation>()

    useEffect(() => {
        fetchAPIJSON("/me").then(res => {
            const body = UserInformation.safeParse(res)
            if (body.data && body.success) {
                body.data.user.schedule = body.data.user.schedule.sort((a, b) => a.block.time - b.block.time)
                body.data.user.schedule = body.data.user.schedule.sort((a, b) => compareBlocksByDate(a.block as Block, b.block as Block))
                setUserData(body.data);
            }
        })
    }, [])

    return (
        <Container className="mt-4" id="home-page">
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>Welcome back, {userData?.user.username}!</Card.Title>
                    <Card.Text>Here’s your upcoming schedule.</Card.Text>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Header>Your Schedule</Card.Header>
                <Card.Body className="p-0">
                    <Table striped bordered hover responsive className="mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Assignment</th>
                                <th>Time</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData?.user.schedule.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-3 text-muted">
                                        No assignments yet.
                                    </td>
                                </tr>
                            ) : (
                                userData?.user.schedule.map((item) =>
                                    (
                                        item.block.time < getCurrentTimeMins() &&
                                        item.block.date == getCurrentDate()
                                    ) ? (
                                        <></>
                                    ) : (
                                        <tr key={item.block.id} id="schedule">
                                            <td style={{ backgroundColor: softenColor(item.assignment.color) }}>{item.assignment.name}</td>
                                            <td style={{ backgroundColor: softenColor(item.assignment.color) }}>{toFormattedTime(item.block.time)}</td>
                                            <td style={{ backgroundColor: softenColor(item.assignment.color) }}>{item.block.date}</td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;
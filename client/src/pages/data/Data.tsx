import { JSX, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./Data.css";
import FormRows from "./viewers/FormRows";
import AveragedRows from "./viewers/AveragedRows";
import TeamRows from "./viewers/TeamRows";

const VIEW_OPTIONS: { title: string; description: string; component: JSX.Element }[] = [
    {
        title: "Team Summary View",
        description: "Get a summary of a team's performance and compare with others.",
        component: <h1 children="WIP" /> // <TeamSummary />
    },
    {
        title: "Team Compare View",
        description: "Compare the summaries of two teams.",
        component: <h1 children="WIP" /> //
    },
        {
        title: "Raw Team Data",
        description: "View all raw scouting data for a single team, across all forms.",
        component: <TeamRows />
    },
    {
        title: "Team Averages",
        description: "See averaged stats for each team across all their matches.",
        component: <AveragedRows />
    },
    {
        title: "Raw Form Data",
        description: "View all individual form submissions exactly as they were entered.",
        component: <FormRows />
    },
];

export default function Data() {
    const [viewer, setViewer] = useState<number>();

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("viewer");
        if (id !== null && id !== undefined && !Number.isNaN(parseInt(id))) setViewer(parseInt(id));
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("viewer", viewer?.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    }, [viewer]);

    return (
        <div className="container mt-4">
            {viewer == undefined || viewer == null || viewer > VIEW_OPTIONS.length ? (<>
                <h2 className="mb-4">Select a Data View</h2>
                <Row xs={1} sm={2} md={2} className="g-4">
                    {VIEW_OPTIONS.map((view, i) => (
                        <Col key={i}>
                            <Card
                                onClick={() => setViewer(i)}
                                className="h-100 shadow-sm hover-shadow transition card-hover"
                                style={{ cursor: "pointer" }}
                            >
                                <Card.Body>
                                    <Card.Title>{view.title}</Card.Title>
                                    <Card.Text>{view.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </>) : (
                <div className="mt-4">
                    {VIEW_OPTIONS[viewer].component}
                </div>
            )}
        </div>
    );
}

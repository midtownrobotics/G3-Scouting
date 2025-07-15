import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./Data.css";
import FormView from "./FormView";
import TeamDataCard from "./TeamDataCard";
import TeamDataPage from "./TeamDataPage";
import TeamView from "./TeamView";

const VIEW_OPTIONS: { title: string; description: string; }[] = [
    {
        title: "Raw Form View",
        description: "View all individual form submissions exactly as they were entered."
    },
    {
        title: "Raw Team View",
        description: "View all raw scouting data for a single team, across all forms."
    },
    {
        title: "Team Averages View",
        description: "See averaged stats for each team across all their matches."
    },
    {
        title: "Team Summary View",
        description: "Get a summary of each team's performance in a more readable format."
    }
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
                    {viewer === 0 && <FormView />}
                    {viewer === 1 && <TeamDataPage />}
                    {viewer === 2 && <TeamView />}
                    {viewer === 3 && <TeamDataCard />}
                </div>
            )}
        </div>
    );
}

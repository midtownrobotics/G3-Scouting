import { JSX, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import AveragedRows from "./viewers/AveragedRows";
import FormRows from "./viewers/FormRows";
import TeamRows from "./viewers/TeamRows";
import { makeUrlParam } from "../../utils";

const VIEW_OPTIONS: { title: string; description: string; component: (a: number) => JSX.Element; }[] = [
    {
        title: "Team Summary View",
        description: "Get a summary of a team's performance and compare with others.",
        component: () => <h1 children="WIP" /> // <TeamSummary />
    },
    {
        title: "Team Compare View",
        description: "Compare the summaries of two teams.",
        component: () => <h1 children="WIP" /> //
    },
    {
        title: "Raw Team Data",
        description: "View all raw scouting data for a single team, across all forms.",
        component: (a) => <TeamRows accuracy={a} />
    },
    {
        title: "Team Averages",
        description: "See averaged stats for each team across all their matches.",
        component: (a) => <AveragedRows accuracy={a} />
    },
    {
        title: "Raw Form Data",
        description: "View all individual form submissions exactly as they were entered.",
        component: (a) => <FormRows accuracy={a} />
    },
];

export default function Data() {
    const [viewer, setViewer] = useState<number>();
    const [accuracy, _setAccuracy] = useState<number>();

    const setAccuracy = (to: number) => {
        let val = to;
        if (to > 100) val = 100;
        if (to < 0) val = 0;
        if (!isFinite(to)) val = 0;
        _setAccuracy(val);
    };

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("viewer");
        if (id !== null && id !== undefined && !Number.isNaN(parseInt(id))) setViewer(parseInt(id));
        const acc = new URLSearchParams(window.location.search).get("accuracy");
        if (acc !== null && acc !== undefined) setAccuracy(parseInt(acc));
    }, []);

    makeUrlParam("viewer", viewer);
    makeUrlParam("accuracy", accuracy);

    return (
        <div className="container mt-4" id="data-page">
            {viewer == undefined || viewer == null || viewer > VIEW_OPTIONS.length ? (
                <>
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
                </>
            ) : (
                <div>
                    <Card className="ms-3 bg-primary-subtle" style={{ width: "210px" }}>
                        <Card.Body>
                            <div className="d-flex align-items-center m-auto">
                                <Form.Label className="ms-3 me-1 mb-1">Min accuracy:</Form.Label>
                                <input
                                    style={{ width: "35px", height: "25px" }}
                                    className="text-center"
                                    value={accuracy ?? 90}
                                    onChange={e => setAccuracy(parseInt(e.target.value))}
                                />
                                <Form.Label className="ms-1 me-0 mb-1">%</Form.Label>
                            </div>
                        </Card.Body>
                    </Card>
                    {VIEW_OPTIONS[viewer].component(accuracy ?? 90)}
                </div>
            )}
        </div>
    );
}

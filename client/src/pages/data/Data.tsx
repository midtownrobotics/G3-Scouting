import { JSX, useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import AveragedRows from "./viewers/AveragedRows";
import FormRows from "./viewers/FormRows";
import TeamRows from "./viewers/TeamRows";
import { makeUrlParam } from "../../utils";
import TeamSummary from "./viewers/TeamSummary";
import MatchReview from "./viewers/MatchReview";
import { defaultAccuracy } from "./helpers/utils";
import BooleanSearch from "./viewers/BooleanSearch";
import './Data.css';
import TeamResponseInfo from "./viewers/TeamResponseInfo";
import PickList from "./viewers/PickList";

const VIEW_OPTIONS: { hideOptions?: boolean; title: string; description: string; component: (a: number, m: number) => JSX.Element; }[] = [
    {
        title: "Team Summary View",
        description: "Get a summary of a team's performance and compare with others.",
        component: (a, m) => <TeamSummary accuracy={a} fromMatch={m} />
    },
    {
        title: "Match Review/Preview",
        description: "See estimated and previous scores for matches.",
        component: (a, m) => <MatchReview accuracy={a} fromMatch={m} />
    },
    {
        title: "Raw Team Data",
        description: "View all raw scouting data for a single team, across all forms.",
        component: (a, m) => <TeamRows accuracy={a} fromMatch={m} />
    },
    {
        title: "Team Averages",
        description: "See averaged stats for each team across all their matches.",
        component: (a, m) => <AveragedRows accuracy={a} fromMatch={m} />
    },
    {
        title: "Raw Form Data",
        description: "View all individual form submissions exactly as they were entered.",
        component: (a, m) => <FormRows accuracy={a} fromMatch={m} />
    },
    {
        title: "Boolean Search",
        description: "Create a custom search query to look for teams that meet your needs.",
        component: (a, m) => <BooleanSearch accuracy={a} fromMatch={m} />
    },
    {
        title: "Team Response Numbers",
        description: "See how many responses each team has per form.",
        component: (a, m) => <TeamResponseInfo accuracy={a} fromMatch={m} />
    },
    {
        title: "Pick List",
        description: "Order teams by pick-ability (or un-pick-ability) and write notes.",
        component: () => <PickList />,
        hideOptions: true
    },
];

export default function Data() {
    const [viewer, setViewer] = useState<number>();
    const [accuracy, _setAccuracy] = useState<number>();
    const [fromMatch, setFromMatch] = useState<number>();

    const setAccuracy = (to: number) => {
        let val = to;
        if (to < 0) val = 0;
        if (!isFinite(to)) val = 0;
        _setAccuracy(val);
    };

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("viewer");
        if (id !== null && id !== undefined && !Number.isNaN(parseInt(id))) setViewer(parseInt(id));
        const acc = new URLSearchParams(window.location.search).get("accuracy");
        if (acc !== null && acc !== undefined && !Number.isNaN(parseInt(acc))) setAccuracy(parseInt(acc));
        const match = new URLSearchParams(window.location.search).get("match");
        if (match !== null && acc !== undefined) setFromMatch(parseInt(match));
    }, []);

    makeUrlParam("viewer", viewer);
    makeUrlParam("accuracy", accuracy);
    makeUrlParam("match", fromMatch);

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
                    <Row className="w-md-50">
                        <Col>
                            <Card className="ms-3 bg-primary-subtle" hidden={VIEW_OPTIONS[viewer].hideOptions}>
                                <Card.Body className="mx-auto w-0">
                                    <div className="d-flex align-items-center">
                                        <Form.Label className="me-1 mb-1">Max error:</Form.Label>
                                        <input
                                            style={{ width: "45px", height: "25px" }}
                                            className="text-center"
                                            value={accuracy ?? defaultAccuracy}
                                            onChange={e => setAccuracy(parseInt(e.target.value))}
                                        />
                                        <Form.Label className="ms-1 me-0 mb-0">%</Form.Label>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="ms-3 bg-primary-subtle" hidden={VIEW_OPTIONS[viewer].hideOptions}>
                                <Card.Body className="mx-auto">
                                    <div className="d-flex align-items-center">
                                        <Form.Label className="me-1 mb-1">From match:</Form.Label>
                                        <input
                                            style={{ width: "45px", height: "25px" }}
                                            className="text-center"
                                            value={fromMatch || 0}
                                            onChange={e => setFromMatch(parseInt(e.target.value))}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {VIEW_OPTIONS[viewer].component(accuracy ?? defaultAccuracy, fromMatch || 0)}
                </div>
            )}
        </div>
    );
}

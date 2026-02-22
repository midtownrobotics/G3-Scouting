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
import DataStats from "./viewers/DataStats";

const VIEW_OPTIONS: { hideOptions?: boolean; title: string; description: string; component: (a: number, fm: number, tm: number) => JSX.Element; }[] = [
    {
        title: "Team Summary View",
        description: "Get a summary of a team's performance and compare with others.",
        component: (a, b, c) => <TeamSummary accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Match Review/Preview",
        description: "See estimated and previous scores for matches.",
        component: (a) => <MatchReview accuracy={a} />
    },
    {
        title: "Raw Team Data",
        description: "View all raw scouting data for a single team, across all forms.",
        component: (a, b, c) => <TeamRows accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Team Averages",
        description: "See averaged stats for each team across all their matches.",
        component: (a, b, c) => <AveragedRows accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Raw Form Data",
        description: "View all individual form submissions exactly as they were entered.",
        component: (a, b, c) => <FormRows accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Boolean Search",
        description: "Create a custom search query to look for teams that meet your needs.",
        component: (a, b, c) => <BooleanSearch accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Team Response Numbers",
        description: "See how many responses each team has per form.",
        component: (a, b, c) => <TeamResponseInfo accuracy={a} fromMatch={b} toMatch={c} />
    },
    {
        title: "Pick List",
        description: "Order teams by pick-ability (or un-pick-ability) and write notes.",
        component: () => <PickList />,
        hideOptions: true
    },
    {
        title: "Data Stats",
        description: "See % coverage, averages error, and under-scouted teams.",
        component: () => <DataStats />
    }
];

export default function Data() {
    const [viewer, setViewer] = useState<number>();
    const [accuracy, _setAccuracy] = useState<number>();
    const [fromMatch, setFromMatch] = useState<number>();
    const [toMatch, setToMatch] = useState<number>();

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
        const fromMatch = new URLSearchParams(window.location.search).get("fromMatch");
        if (fromMatch !== null && fromMatch !== undefined) setFromMatch(parseInt(fromMatch));
        const toMatch = new URLSearchParams(window.location.search).get("toMatch");
        if (toMatch !== null && toMatch !== undefined) setFromMatch(parseInt(toMatch));
    }, []);

    makeUrlParam("viewer", viewer);
    makeUrlParam("accuracy", accuracy);
    makeUrlParam("fromMatch", fromMatch);
    makeUrlParam("toMatch", toMatch);

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
                    <Row className="w-md-75">
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
                        <Col>
                            <Card className="ms-3 bg-primary-subtle" hidden={VIEW_OPTIONS[viewer].hideOptions}>
                                <Card.Body className="mx-auto">
                                    <div className="d-flex align-items-center">
                                        <Form.Label className="me-1 mb-1">To match:</Form.Label>
                                        <input
                                            style={{ width: "45px", height: "25px" }}
                                            className="text-center"
                                            value={toMatch || 0}
                                            onChange={e => setToMatch(parseInt(e.target.value))}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {VIEW_OPTIONS[viewer].component(accuracy ?? defaultAccuracy, fromMatch || 0, toMatch || 0)}
                </div>
            )}
        </div>
    );
}

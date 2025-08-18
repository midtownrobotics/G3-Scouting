import { PitMonitorData, RankingRow, ScheduledMatch } from "@shared/schemas/pit";
import { AssignmentType, UserScheduleData } from "@shared/schemas/schedule";
import { Clock, Maximize2, Minimize2, RefreshCw, Users, Wrench } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../API";
import { getAssignmentDuration } from "../../utils";

// ---------- Data Hook ----------
function usePitMonitor(teamNumber: number, refreshSec: number) {
    const [data, setData] = useState<PitMonitorData>();
    const [schedules, setSchedules] = useState<UserScheduleData[]>();
    const currentSchedules = schedules?.filter(s => s.current !== undefined && s.current.type === AssignmentType.PIT);

    async function fetchAll() {
        const pitData = await fetchAPIJSON("/pit/data", PitMonitorData);
        setData(pitData);

        await fetchAPIJSON("/schedules", UserScheduleData.array()).then(res => {
            if (res) setSchedules(res);
        });
    }

    useEffect(() => {
        fetchAll();
        const t = setInterval(fetchAll, refreshSec * 1000);
        return () => clearInterval(t);
    }, [teamNumber, refreshSec]);

    return { data, refetch: fetchAll, currentSchedules };
}

// ---------- Components ----------
const PitNowCard: React.FC<{ currentSchedules: UserScheduleData[]; }> = ({ currentSchedules }) => (
    <Card>
        <Card.Header><Wrench size={18} className="me-2" /> In the Pit Now</Card.Header>
        <Card.Body className="pb-0">
            <Row>
                {
                    currentSchedules?.map(s => {
                        const minsLeft = getAssignmentDuration(s.current, s.schedule);
                        if (minsLeft === null) return <></>;

                        let timeColor = "success";
                        if (minsLeft <= 20) timeColor = "warning";

                        return (
                            <Col key={s.id} xs={6} md={4} lg={3}>
                                <div className={`mb-3 border rounded p-2 text-center bg-${timeColor}-subtle`}>
                                    <div className="fw-bold">{s.name}</div>
                                    <div>{minsLeft}mins</div>
                                </div>
                            </Col>
                        );
                    })
                }
            </Row>
        </Card.Body>
    </Card>
);

const RankingCard: React.FC<{ row?: RankingRow; }> = ({ row }) => (
    <Card>
        <Card.Header><Users size={18} className="me-2" /> Team Ranking</Card.Header>
        <Card.Body>
            {row ? (
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="display-4 mb-0 me-2">#{row.rank}</h1>
                    <Table bordered size="sm" className="mb-0 text-center">
                        <thead>
                            <tr>
                                <th>W-L-T</th>
                                <th>RP</th>
                                <th>EPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{row.wins}-{row.losses}-{row.ties ?? 0}</td>
                                <td>{row.rp}</td>
                                <td>{row.epa}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            ) : <div>No ranking yet.</div>}
        </Card.Body>
    </Card>
);

const MatchRow: React.FC<{ m: ScheduledMatch; teamNumber: number; }> = ({ m, teamNumber }) => (
    <tr>
        <td
            className="border"
        >#{m.number}</td>
        {m.blue.map(t =>
            <td
                className={[
                    m.blue.includes(teamNumber) && "bg-primary-subtle",
                    t === teamNumber && "fw-bold"
                ].filter(i => typeof i !== "boolean").join(" ")}
            >{t}</td>
        )}
        {m.red.map((t, ti) =>
            <td
                className={[
                    m.red.includes(teamNumber) && "bg-danger-subtle",
                    t === teamNumber && "fw-bold",
                    ti === 2 && "border-end"
                ].filter(i => typeof i !== "boolean").join(" ")}
            >{t}</td>
        )}
    </tr>
);

const UpcomingMatchesCard: React.FC<{ matches: ScheduledMatch[]; teamNumber: number; }> = ({ matches, teamNumber }) => (
    <Card>
        <Card.Header><Clock size={18} className="me-2" /> Upcoming Matches</Card.Header>
        <Card.Body>
            {matches.length === 0 ? <div>No matches scheduled.</div> : (
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th></th>
                            <th colSpan={3}>Blue</th>
                            <th colSpan={3}>Red</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(m => <MatchRow m={m} teamNumber={teamNumber} />)}
                    </tbody>
                </Table>
            )}
        </Card.Body>
    </Card>
);

// ---------- Root ----------
export default function PitMonitor() {
    const { data, refetch, currentSchedules } = usePitMonitor(1648, 30);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        if (fullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
        if (!fullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => { });
    }, [fullscreen]);

    return (
        <Container fluid className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>G3 Robotics 1648 — Pit Monitor</h2>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={refetch}><RefreshCw size={14} className="me-1" /> Refresh</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => setFullscreen(!fullscreen)}>
                        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />} Screen
                    </Button>
                </div>
            </div>

            <Row className="mt-3 g-3">
                <Col lg={7}>
                    <UpcomingMatchesCard matches={data?.upcoming ?? []} teamNumber={1648} />
                </Col>
                <Col lg={5}>
                    <RankingCard row={data?.ranking} />
                    <div className="mt-3"><PitNowCard currentSchedules={currentSchedules ?? []} /></div>
                </Col>
            </Row>
        </Container>
    );
}
import { NexusEventStatus, NexusMatch, PitMonitorData, RankingRow } from "@shared/schemas/pit";
import { AssignmentType, UserScheduleData } from "@shared/schemas/schedule";
import { Clock, Maximize2, Minimize2, RefreshCw, Users, Wrench } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../API";
import { getAssignmentDuration } from "../../utils";
import { Asterisk } from "react-bootstrap-icons";
import Countdown from "./Countdown";

function teamInMatch(m: NexusMatch, t: number) {
    return (
        m.blueTeams?.includes(t.toString()) ||
        m.redTeams?.includes(t.toString())
    );
}

// ---------- Data Hook ----------
function usePitMonitor(refreshSec: number) {
    const [data, setData] = useState<PitMonitorData>();
    const [schedules, setSchedules] = useState<UserScheduleData[]>();
    const currentSchedules = schedules?.filter(s => s.current !== undefined && s.current.type === AssignmentType.PIT);
    const [ourMatches, setOurMatches] = useState<NexusMatch[]>();

    async function fetchAll() {
        const pitData = await fetchAPIJSON("/pit/data", PitMonitorData);
        if (pitData) {
            setOurMatches(
                pitData.nexusData.matches.filter(m => teamInMatch(m, pitData.team) && m.status !== "On field")
            );
        }
        setData(pitData);

        await fetchAPIJSON("/schedules", UserScheduleData.array()).then(res => {
            if (res) setSchedules(res);
        });
    }

    useEffect(() => {
        fetchAll();
        const t = setInterval(fetchAll, refreshSec * 1000);
        return () => clearInterval(t);
    }, [refreshSec]);

    return { data, currentSchedules, ourMatches };
}

// ---------- Components ----------
const PitNowCard: React.FC<{ currentSchedules: UserScheduleData[]; }> = ({ currentSchedules }) => (
    <Card>
        <Card.Header><Wrench size={18} className="me-2 mb-1" /> In the Pit Now</Card.Header>
        <Card.Body className="pb-0">
            <Row>
                {
                    currentSchedules?.map(s => {
                        const minsLeft = getAssignmentDuration(s.current, s.schedule);
                        if (minsLeft === null) return <></>;

                        let timeColor = "success";
                        if (minsLeft <= 20) timeColor = "danger";

                        return (
                            <Col key={s.id} lg={2} className="mx-auto">
                                <div className={`mb-3 border rounded p-2 text-center text-light bg-${timeColor}`}>
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
        <Card.Header><Users size={18} className="me-2 mb-1" /> Team Ranking</Card.Header>
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

export const formatTime = (t?: number | null) => {
    if (!t) return "";
    const d = new Date(t);
    return `${(d.getHours() - 1) % 12 + 1}:${d.getMinutes().toString().padStart(2, "0")} ${d.getHours() > 11 ? "PM" : "AM"}`;
};

const MatchRow: React.FC<{ m: NexusMatch; teamNumber: string; }> = ({ m, teamNumber }) => (
    <tr>
        <td
            className="border"
        >{m.label}</td>
        <td
            className="border"
        >{
                m.times.actualQueueTime == null
                    ? <Countdown targetDate={new Date(m.times.estimatedQueueTime ?? 0)} backup={formatTime(m.times.estimatedQueueTime)} />
                    : formatTime(m.times.actualQueueTime)
            }</td>
        <td
            className="border"
        >{formatTime(m.times.estimatedStartTime)}</td>
        {m.blueTeams?.map(t =>
            <td
                className={[
                    m.blueTeams?.includes(teamNumber.toString()) && "bg-primary-subtle",
                    t === teamNumber && "fw-bold"
                ].filter(i => typeof i !== "boolean").join(" ")}
            >{t}</td>
        )}
        {m.redTeams?.map((t, ti) =>
            <td
                className={[
                    m.redTeams?.includes(teamNumber) && "bg-danger-subtle",
                    t === teamNumber && "fw-bold",
                    ti === 2 && "border-end"
                ].filter(i => typeof i !== "boolean").join(" ")}
            >{t}</td>
        )}
    </tr>
);

const UpcomingMatchesCard: React.FC<{ matches: NexusMatch[]; teamNumber: number; }> = ({ matches, teamNumber }) => (
    <Card>
        <Card.Header><Clock size={18} className="me-2 mb-1" /> Upcoming Matches</Card.Header>
        <Card.Body className="pt-0">
            {matches.length === 0 ? <div>No matches scheduled.</div> : (
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th>Match</th>
                            <th>Queue</th>
                            <th>Start</th>
                            <th colSpan={3}>Blue</th>
                            <th colSpan={3}>Red</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(m => <MatchRow m={m} teamNumber={teamNumber.toString()} />)}
                    </tbody>
                </Table>
            )}
        </Card.Body>
    </Card>
);

const NexusCard: React.FC<{ data?: NexusEventStatus, team: number; }> = ({ data, team }) => {
    const matches = data?.matches.sort((b, a) => (a.times.actualOnFieldTime ?? Infinity) - (b.times.actualOnFieldTime ?? Infinity)) ?? [];

    const queuingSoon = matches.find(m => m.status === "Queuing soon");
    const nowQueing = matches.find(m => m.status === "Now queuing");
    const onDeck = matches.find(m => m.status === "On deck");

    return (
        <Card hidden={data === undefined}>
            <Card.Header><Asterisk size={18} className="me-2 mb-1" /> Nexus</Card.Header>
            <Card.Body className="pb-0">
                {onDeck !== undefined &&
                    <Card style={{ color: "#333" }} className={`bg-danger mb-3 bg-opacity-50 fw-bold ${teamInMatch(onDeck, team) ? "border border-5 border-dark" : ""}`}>
                        <Card.Body className={teamInMatch(onDeck, team) ? "fw-bold" : ""}>
                        On Deck: {onDeck?.label}<Countdown prefix={" - On field in "} targetDate={new Date(onDeck?.times.estimatedOnFieldTime ?? 0)} backup=" - Delayed" />
                        </Card.Body>
                    </Card>
                }
                {nowQueing !== undefined &&
                    <Card style={{ color: "#333" }} className={`bg-warning mb-3 fw-bold ${teamInMatch(nowQueing, team) ? "border border-5 border-dark" : ""}`}>
                        <Card.Body>
                            Queuing: {nowQueing?.label}<Countdown prefix={" - On field in "} targetDate={new Date(nowQueing?.times.estimatedOnFieldTime ?? 0)} backup=" - Delayed" />
                        </Card.Body>
                    </Card>
                }
                {queuingSoon !== undefined &&
                    <Card style={{ color: "#333" }} className={`bg-success mb-3 bg-opacity-50 fw-bold ${teamInMatch(queuingSoon, team) ? "border border-5 border-dark" : ""}`}>
                        <Card.Body>
                            Queuing Soon: {queuingSoon?.label}<Countdown prefix={" - In queue in "} targetDate={new Date(queuingSoon?.times.estimatedQueueTime ?? 0)} backup=" - Delayed" />
                        </Card.Body>
                    </Card>
                }
            </Card.Body>
        </Card>
    );
};

// ---------- Root ----------
export default function PitMonitor() {
    const { data, currentSchedules, ourMatches } = usePitMonitor(30);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        if (fullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
        if (!fullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => { });
    }, [fullscreen]);

    return (
        <Container fluid className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#333" }}>G3 Robotics 1648 — Pit Monitor</h2>
                <div>
                    <Button variant="outline-secondary" size="sm" onClick={() => setFullscreen(!fullscreen)}>
                        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />} Screen
                    </Button>
                </div>
            </div>

            <Row className="mt-3 g-3">
                <Col lg={7}>
                    <div><PitNowCard currentSchedules={currentSchedules ?? []} /></div>
                    <div className="mt-3"><UpcomingMatchesCard matches={ourMatches ?? []} teamNumber={data?.team ?? 0} /></div>
                </Col>
                <Col lg={5}>
                    <div><NexusCard data={data?.nexusData} team={data?.team ?? 0} /></div>
                    <div className="mt-3"><RankingCard row={data?.ranking} /></div>
                </Col>
            </Row>
        </Container>
    );
}
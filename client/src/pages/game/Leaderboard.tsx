import { TokenLeaderboardEntry } from "@shared/schemas/game/game";
import { CSSProperties, useEffect, useState } from "react";
import { fetchAPIJSON } from "../../API";
import { z } from "zod";
import { Button, Table } from "react-bootstrap";
import { DollarSign } from "lucide-react";

export function Leaderboard(props: React.HTMLAttributes<HTMLDivElement>) {
    const [leaderboardData, setLeaderboardData] = useState<TokenLeaderboardEntry[]>([]);

    useEffect(() => {
        fetchAPIJSON("/game/leaderboard/tokens", z.array(TokenLeaderboardEntry)).then(d => d && setLeaderboardData(d.sort((a, b) => b.tokens - a.tokens)));
    }, [])

    const [expanded, setExpanded] = useState(false);

    return (
        <div {...props}>
            <h2 className="text-center">Token Leaderboard</h2>
            <div className="justify-content-center d-flex">
                <Table className="w-100 text-center">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>#</th>
                            <th>Username</th>
                            <th style={{ width: "20%" }}>Tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((r, i) => {
                            const bg: CSSProperties = { backgroundColor: getColorFromRank(i + 1), borderColor: getColorFromRank(i + 1) };
                            return (
                                <tr key={r.userId} hidden={i >= 7 && !expanded} className={i == 0 ? "strobe-tr" : ""}>
                                    <td style={bg} className={i == 0 ? "strobe" : ""}>#{i + 1}</td>
                                    <td style={bg} className={i == 0 ? "strobe" : ""} title={r.username}>{formatUsername(r.displayName ?? r.username, i + 1)}</td>
                                    <td style={bg} className={i == 0 ? "strobe" : ""}>{Math.round(r.tokens*100)/100}</td>
                                </tr>
                            );
                        })}
                        <tr>
                            <td colSpan={3}><Button variant="light" style={{ backgroundColor: "#c4c4c4ff" }} className="w-50" onClick={() => setExpanded(!expanded)}>{expanded ? "Show Less" : "Show More"}</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

function getColorFromRank(rank: number) {
    switch (rank) {
        case 2: return "#9b2c3d"; // silver
        case 3: return "#7f7f7f"; // bronze
        default: return "#F8F9FA"; // light neutral for others
    }
}

function formatUsername(name: string, rank: number) {
    if (rank !== 1) return <span>{name}</span>;
    return <b style={{whiteSpace: "nowrap"}}><DollarSign className="spin" />&nbsp;{name}&nbsp;<DollarSign className="spin" /></b>
}
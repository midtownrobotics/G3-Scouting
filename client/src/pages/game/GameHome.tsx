import { useState } from "react";
import { Button } from "react-bootstrap";
import { Betting } from "./Betting";
import { BookiePage } from "./BookiePage";
import "./Game.css";
import { Leaderboard } from "./Leaderboard";

export function GameHome() {
    const [bookiePage, setBookiePage] = useState(false);

    if (bookiePage) return <BookiePage />;

    return (
        <div id="game-page" className="text-center">
            <br />
            <h1>G<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3<sup>3</sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></sup></h1>
            <br />
            <Button onClick={() => setBookiePage(true)}>Open Bookie Page</Button>
            <br />
            <br />
            <Betting />
            <br />
            <div className="d-flex justify-content-center">
                <Leaderboard className="w-75" />
            </div>
        </div>
    )
}
import { Leaderboard } from "./Leaderboard";
import "./Game.css";

export function GameHome() {
    return (
        <div id="game-page">
            <h1 className="text-center">Galvanizing Gambling Games for Glam Gains and Gratitude at Gears for Greater Good</h1>
            <br />
            <br />
            <br />
            <Leaderboard />
        </div>
    )
}
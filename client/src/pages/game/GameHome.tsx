import { Betting } from "./Betting";
import "./Game.css";
import { Leaderboard } from "./Leaderboard";
import LootBoxes from "./lootboxes/LootBoxes";

export function GameHome() {
    return (
        <div id="game-page" className="text-center">
            <br />
            <h1>BoyleBucks Exchange</h1>
            <br />
            <Betting />
            <p className="mx-5"><small>BoyleBucks are for entertainment only and have no real-world monetary value. Click <a href="?page=info">here</a> for more details.</small></p>
            <br />
            <div className="d-flex justify-content-center">
                <Leaderboard className="w-75" />
            </div>
            <div className="d-flex justify-content-center">
                <LootBoxes />
            </div>
        </div>
    )
}
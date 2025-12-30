import { useState, useEffect, useReducer } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Trash } from "react-bootstrap-icons";
import { BatteryData, BatteryState } from "@shared/schemas/pit";
import { fetchAPIJSON, postAPI } from "../../API";
import { z } from "zod";
import { formatDuration } from "../../Utils";

export default function BatteryManager() {
    const [batteries, setBatteries] = useState<BatteryData[]>([]);
    const [newName, setNewName] = useState("");
    const [canAdd, setCanAdd] = useState(false);
    const [working, setWorking] = useState(false);

    const reloadPage = useReducer(x => x + 1, 0)[1];

    useEffect(() => {
        reloadData().then(() => setCanAdd(true));
        const reloadPageInt = setInterval(reloadPage, 200);
        const reloadDataInt = setInterval(reloadData, 10000);
        return () => {
            clearInterval(reloadPageInt);
            clearInterval(reloadDataInt);
        };
    }, []);

    async function reloadData() {
        const data = await fetchAPIJSON("/pit/batteries", z.array(BatteryData));
        if (data) setBatteries(data);
    };

    async function addBattery() {
        if (!canAdd) return;
        setCanAdd(false);
        await postAPI("/pit/newBattery", { name: newName });
        await reloadData();
        setCanAdd(true);
        setNewName("");
    }

    async function deleteBattery(id: number) {
        setWorking(true);
        await postAPI("/pit/deleteBattery", { id });
        await reloadData();
        setWorking(false);
    }

    async function updateState(id: number, state: BatteryState) {
        setWorking(true);
        await postAPI("/pit/setBatteryState", { id, state });
        await reloadData();
        setWorking(false);
    }

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="m-0">Battery Manager</h1>
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="New battery name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyUp={e => { if (e.key === "Enter") addBattery(); }}
                        disabled={!canAdd}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={addBattery}
                        disabled={!canAdd}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="row g-3">
                {batteries
                    .sort((a, b) => a.stateSince - b.stateSince)
                    .sort((a, b) => {
                        if (a.state === BatteryState.CHARGING && b.state !== BatteryState.CHARGING) return -1;
                        if (a.state !== BatteryState.CHARGING && b.state === BatteryState.CHARGING) return 1;
                        return 0;
                    })
                    .sort((a, b) => {
                        if (a.state === BatteryState.IN_ROBOT && b.state !== BatteryState.IN_ROBOT) return -1;
                        if (a.state !== BatteryState.IN_ROBOT && b.state === BatteryState.IN_ROBOT) return 1;
                        return 0;
                    })
                    .map(b => (
                        <div key={b.name} className="col-12">
                            <div className={`card shadow-sm ${b.state === BatteryState.CHARGING ? "bg-success-subtle" : b.state === BatteryState.IN_ROBOT ? "bg-primary-subtle" : ""}`}>
                                <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="card-title mb-1">{b.name}</h5>
                                        <p className="card-text mb-1"><strong>State:</strong> {b.state}</p>
                                        <p className="card-text"><strong>In state:</strong> {formatDuration(b.stateSince)}</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <select
                                            className="form-select"
                                            style={{ width: "120px" }}
                                            value={b.state}
                                            onChange={(e) => updateState(b.id ?? -1, e.target.value as BatteryState)}
                                            disabled={working}
                                        >
                                            <option value={BatteryState.CHARGING}>Charging</option>
                                            <option value={BatteryState.IDLE}>Idle</option>
                                            <option value={BatteryState.BROKEN}>Broken</option>
                                            <option value={BatteryState.IN_ROBOT}>In Robot</option>
                                        </select>
                                        <button className="btn btn-danger" onClick={() => deleteBattery(b.id ?? -1)} disabled={working}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

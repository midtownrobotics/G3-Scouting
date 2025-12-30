import { MiscTeamData, PickListItem, ServerToClientMessage } from "@shared/schemas/data";
import { useEffect, useReducer, useRef, useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { ArrowDown, ArrowUp, X } from "react-bootstrap-icons";
import TeamNumberInput from "../helpers/TeamNumberInput";
import { getWebsocket } from "../../../Utils";
import { sendWsMsg } from "../helpers/pickListWebsocket";
import { fetchAPIJSON } from "../../../API";

export default function PickList() {
    const [list0, setList0] = useState<PickListItem[]>([]);
    const [list1, setList1] = useState<PickListItem[]>([]);
    const lists = [
        { get: list0, set: setList0 },
        { get: list1, set: setList1 }
    ];

    const [newTeamNum, setNewTeamNum] = useState<number>();
    const [newTeamName, setNewTeamName] = useState<string>();

    const [highlighted, setHighlighted] = useState<number>();

    const [working, setWorking] = useState(false);

    const [error, _setError] = useState("");
    const setError = (err: string) => {
        _setError(err);
        setWorking(false);
        setTimeout(() => _setError(""), 1000);
    }

    const [reconnectWsTries, reconnectWs] = useReducer((p) => p + 1, 0);
    const websocket = useRef<WebSocket>(undefined);

    useEffect(() => {
        const ws = getWebsocket("pickList");
        websocket.current = ws;

        if (ws) ws.onmessage = (e) => {
            try {
                const json = JSON.parse(e.data.toString());
                const msg = ServerToClientMessage.parse(json);

                console.log(msg)

                switch (msg.type) {
                    case "getPickList":
                        lists[msg.payload.id].set(msg.payload.list);
                }
            } catch (err) { };
        }

        return () => ws?.close();
    }, [reconnectWsTries]);

    const setListInCloud = (list: PickListItem[], id: number) => {
        sendWsMsg(websocket.current, {
            type: "setPickList",
            payload: { list, id }
        });
    }

    const addNewTeam = async (id: number) => {
        setWorking(true);
        if (!newTeamName || !newTeamNum) return setError("ERR: No team entered.");
        if (lists[id].get.some(li => li.teamNumber == newTeamNum)) return setError("ERR: Team already added.");

        const teamData = await fetchAPIJSON(`/data/getMiscTeamData/${newTeamNum}`, MiscTeamData);
        if (!teamData) return setError("ERR: Could not fetch team data.");

        setListInCloud([...lists[id].get, {
            teamNumber: newTeamNum,
            teamName: newTeamName,
            epa: teamData.epa,
            notes: ""
        }], id);
        setWorking(false);
    }

    const removeTeam = (num: number, id: number) => {
        setListInCloud(lists[id].get.filter(li => li.teamNumber !== num), id);
        setHighlighted(undefined);
    }

    const moveTeam = (num: number, up: boolean, id: number) => {
        const list = lists[id].get;
        const index = list.findIndex(li => li.teamNumber == num);
        if (index === -1 || (up && index === 0) || (!up && index === list.length - 1)) return;

        const destinationIndex = up ? index - 1 : index + 1;
        const itemToMove = list[index];
        const newList = [...list];

        newList.splice(index, 1);
        newList.splice(destinationIndex, 0, itemToMove);

        setListInCloud(newList, id);
        setHighlighted(destinationIndex);
    }

    const setTeamNotes = (team: number, notes: string, id: number) => {
        const newList = [...lists[id].get];
        const idx = newList.findIndex(li => li.teamNumber == team)
        if (idx >= 0) {
            newList[idx].notes = notes;
            setListInCloud(newList, id);
        }
    }

    return (
        <div id="pickList-page">
            <h1>Pick-List Page</h1>
            <br />
            <Row className="mt-0">
                {websocket.current?.readyState !== WebSocket.OPEN && (
                    <Alert variant="danger" className="w-75 w-md-50 mx-auto text-center mb-4 shadow-sm">
                        <span>
                            WebSocket disconnected. Click{" "}
                            <span
                                className="fw-bold text-primary text-decoration-underline cursor-pointer"
                                onClick={reconnectWs}
                            >here</span>{" "}
                            to reconnect.
                        </span>
                    </Alert>
                )}
                <Col lg={3}>
                    <TeamNumberInput onChange={(nb, nm) => { setNewTeamNum(nb); setNewTeamName(nm); }} />
                    <div className="d-flex gap-2 mt-2   ">
                        <Button variant="success" onClick={() => addNewTeam(0)} className="mb-3 flex-fill" disabled={working}>Add Pick</Button>
                        <Button variant="danger" onClick={() => addNewTeam(1)} className="mb-3 flex-fill" disabled={working}>Add No-Pick</Button>
                    </div>
                    {error !== "" &&
                        <Alert variant="danger" className="text-center">{error}</Alert>
                    }
                </Col>
                <Col lg={9}>
                    <Table bordered onMouseLeave={() => setHighlighted(undefined)}>
                        <thead>
                            <tr className="text-center">
                                <td style={{ width: "20px" }}></td>
                                <td style={{ width: "20px" }}></td>
                                <td style={{ width: "20px" }}></td>
                                <td className="col-1">Rank</td>
                                <td className="col-3" colSpan={2}>Team</td>
                                <td className="col-1">EPA</td>
                                <td>Notes</td>
                            </tr>
                        </thead>
                        <tbody>
                            {lists[0].get.map((li, idx) =>
                                <TeamRow
                                    remove={(...a) => removeTeam(...a, 0)}
                                    move={(...a) => moveTeam(...a, 0)}
                                    data={li}
                                    index={idx}
                                    highlighted={highlighted}
                                    onHover={() => setHighlighted(idx)}
                                    setTeamNotes={(...a) => setTeamNotes(...a, 0)}
                                />
                            )}
                        </tbody>
                    </Table>
                    <Table bordered onMouseLeave={() => setHighlighted(undefined)}>
                        <thead>
                            <tr className="text-center">
                                <td style={{ width: "20px" }}></td>
                                <td className="col-3" colSpan={2}>Team</td>
                                <td className="col-1">EPA</td>
                                <td>Notes</td>
                            </tr>
                        </thead>
                        <tbody>
                            {lists[1].get.map((li, idx) =>
                                <TeamRow
                                    remove={(...a) => removeTeam(...a, 1)}
                                    move={(...a) => moveTeam(...a, 1)}
                                    data={li}
                                    index={idx}
                                    onHover={() => { }}
                                    setTeamNotes={(...a) => setTeamNotes(...a, 1)}
                                    noPick
                                />
                            )}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

function TeamRow({ remove, move, data, index, highlighted, onHover, setTeamNotes, noPick }: {
    remove: (team: number) => void,
    move: (team: number, up: boolean) => void,
    data: PickListItem,
    index: number,
    highlighted?: number,
    onHover: () => void,
    setTeamNotes: (team: number, notes: string) => void,
    noPick?: boolean
}) {
    return (
        <tr
            className={highlighted == index ? "bg-color-hl" : "bg-color-reg"}
            onMouseEnter={onHover}
        >
            {!noPick && <><td>
                <ArrowUp
                    onClick={() => move(data.teamNumber, true)}
                    className="text-success cursor-pointer mx-auto"
                    size={20}
                />
            </td>
                <td>
                    <ArrowDown
                        onClick={() => move(data.teamNumber, false)}
                        className="text-success cursor-pointer mx-auto"
                        size={20}
                    />
                </td></>}
            <td>
                <X
                    onClick={() => remove(data.teamNumber)}
                    className="text-danger cursor-pointer mx-0"
                    size={30}
                />
            </td>
            {!noPick && <td>#{index + 1}</td>}
            <td>
                <a href={`/?page=data&viewer=0&team=${data.teamNumber}`} target="_blank">
                    {data.teamNumber}
                </a>
            </td>
            <td>
                <a href={`/?page=data&viewer=0&team=${data.teamNumber}`} target="_blank">
                    {data.teamName}
                </a>
            </td>
            <td>{data.epa}</td>
            <td>
                <input
                    value={data.notes}
                    onChange={(e) => setTeamNotes(data.teamNumber, e.target.value)}
                    className="w-100"
                />
            </td>
        </tr>
    )
}
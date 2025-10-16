import { GamblingQuestion, ResponseBetData, ServerToClientMessage } from "@shared/schemas/game";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Alert, Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import { Floppy, XSquareFill } from "react-bootstrap-icons";
import { useUserData } from "../../userData";
import { getWebsocket, sendWsMsg } from "./utils/websocket";

export function Betting() {
    const [question, setQuestion] = useState<GamblingQuestion>();
    const websocket = useRef<WebSocket>(undefined);

    const [responseIndex, setResponseIndex] = useState(0);
    const [inDbResponseIndex, setInDbResponseIndex] = useState(0);
    const [amount, setAmount] = useState(0);
    const [inDbAmount, setInDbAmount] = useState(0);
    const [reconnectWsTries, reconnectWs] = useReducer((p) => p + 1, 0);

    const [betData, setBetData] = useState<ResponseBetData[]>([]);

    const [responseLoading, setResponseLoading] = useState(false);

    const [betPlaced, setBetPlaced] = useState(false);

    const userProvider = useUserData();
    const tokens = userProvider.userData?.user.tokens ?? 0;

    useEffect(() => {
        const ws = getWebsocket();
        websocket.current = ws;

        if (ws) ws.onmessage = (e) => {
            try {
                const json = JSON.parse(e.data.toString());
                const msg = ServerToClientMessage.parse(json);

                console.log(msg.type)

                switch (msg.type) {
                    case "betData":
                        setBetData(msg.payload)
                        break;
                    case "userResponse":
                        setResponseLoading(false);
                        setInDbResponseIndex(() => msg.payload.responseIndex);
                        setResponseIndex(() => msg.payload.responseIndex);
                        setAmount(() => msg.payload.amount);
                        setInDbAmount(() => msg.payload.amount);
                        if (msg.payload.amount > 0) setBetPlaced(true);
                        break;
                    case "updateQuestion":
                        setQuestion(() => msg.payload)
                        break;
                }
            } catch (err) { };
        }

        return () => ws?.close();
    }, [reconnectWsTries]);

    function saveResponse() {
        if (question === undefined) return;
        setResponseLoading(true);
        sendWsMsg(websocket.current, {
            type: "placeBet",
            payload: {
                match: question.match,
                amount,
                responseIndex
            }
        })
    }

    function cancelBet() {
        if (question === undefined) return;
        sendWsMsg(websocket.current, {
            type: "dropBet",
            payload: {
                match: question.match
            }
        })
        setBetPlaced(false);
    }

    const maxPayout = useMemo(() => {
        if (!betPlaced || betData[responseIndex] === undefined) return undefined;
        const pot = betData.reduce((a, b) => a + b.totalBet, 0);
        return Math.round(pot * (inDbAmount / betData[inDbResponseIndex].totalBet));
    }, [betPlaced, betData, responseIndex, inDbAmount, inDbResponseIndex]);

    if (question === undefined) return (<></>);

    return (
        <div className="w-100">
            {websocket.current?.readyState !== WebSocket.OPEN && <Alert variant="danger" className="w-50 mx-auto">
                <span>
                    WebSocket disconnected. Click&nbsp;
                    <span
                        className="text-primary text-decoration-underline cursor-pointer"
                        onClick={reconnectWs}
                    >here</span>
                    &nbsp;to reconnect.
                </span>
            </Alert>}
            <Card className="w-md-50 mx-auto">
                <Card.Body>

                    <h2>Match {question.match}</h2>
                    <h4>{question.question}</h4>

                    <div className="d-flex flex-column gap-2 w-100 justify-content-center mb-2">
                        {question.responses.map((r, i) =>
                            <div key={i} className="d-flex gap-2 justify-content-center">
                                <Button
                                    onClick={() => setResponseIndex(i)}
                                    variant={i === responseIndex ? "success" : "secondary"}
                                >
                                    {r}
                                </Button>
                                <h4>{(betData[i]?.percent || 0) * 100}% - ${betData[i]?.totalBet ?? 0}</h4>
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-2 w-100 justify-content-center mb-2">
                        <InputGroup style={{ width: "150px" }}>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                min={0}
                                max={tokens}
                                value={amount.toString()}
                                onChange={(e) => setAmount(Math.min(Math.max(parseInt(e.target.value) || 0, 0), tokens))}
                            />
                        </InputGroup>
                    </div>

                    <Button
                        variant="light"
                        onClick={saveResponse}
                        className="mb-2"
                        style={{ width: "150px", borderColor: "lightgray" }}
                        disabled={
                            responseLoading ||
                            amount < 1 ||
                            amount > tokens
                        }
                    >
                        {responseLoading ? <Spinner size="sm" /> : <div>Save <Floppy /></div>}
                    </Button>

                    <br />

                    <Button
                        variant="light"
                        onClick={cancelBet}
                        className="mb-2"
                        style={{ width: "150px", borderColor: "lightgray" }}
                    >
                        <div>Cancel <XSquareFill /></div>
                    </Button>

                    {maxPayout !== undefined && <h5>Maximum payout: ${maxPayout.toLocaleString()}</h5>}

                </Card.Body>
            </Card>
        </div>
    )
}
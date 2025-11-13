import { GamblingQuestion, ResponseBetData, ServerToClientMessage } from "@shared/schemas/game";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Alert, Button, Card, Form, InputGroup } from "react-bootstrap";
import { useUserData } from "../../userData";
import { getWebsocket, sendWsMsg } from "./utils/websocket";

export function Betting() {
    const [question, setQuestion] = useState<GamblingQuestion>();
    const websocket = useRef<WebSocket>(undefined);

    const [responseIndex, setResponseIndex] = useState(0);
    const [amount, setAmount] = useState(0);
    const [reconnectWsTries, reconnectWs] = useReducer((p) => p + 1, 0);

    const [betData, setBetData] = useState<ResponseBetData[]>([]);

    const userProvider = useUserData();
    const tokens = userProvider.userData?.user.tokens ?? 0;

    useEffect(() => {
        const ws = getWebsocket();
        websocket.current = ws;

        if (ws) ws.onmessage = (e) => {
            try {
                const json = JSON.parse(e.data.toString());
                const msg = ServerToClientMessage.parse(json);

                console.log(msg)

                switch (msg.type) {
                    case "betData":
                        console.log("got here")
                        setBetData(() => msg.payload)
                        break;
                    case "userResponse":
                        setResponseIndex(() => msg.payload.responseIndex);
                        setAmount(() => msg.payload.amount);
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
        sendWsMsg(websocket.current, {
            type: "placeBet",
            payload: {
                match: question.match,
                amount,
                responseIndex
            }
        })
    }

    useEffect(() => {
        console.log(amount)
        if (amount == 0 && question?.match) {
            sendWsMsg(websocket.current, {
                type: "dropBet",
                payload: {
                    match: question.match
                }
            })
        } else {
            saveResponse();
        }
    }, [responseIndex, amount]);

    const maxPayout = useMemo(() => {
        if (amount == 0) return undefined;
        if (betData[responseIndex] === undefined) return undefined;
        const pot = betData.reduce((a, b) => a + b.totalBet, 0);
        return Math.round(pot * (amount / betData[responseIndex].totalBet));
    }, [betData, responseIndex]);

    if (question === undefined) return (<></>);

    return (
        <div>
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
                    <hr />
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

                    <hr />

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

                    <br />

                    {maxPayout !== undefined && <h5>Maximum payout: ${maxPayout.toLocaleString()}</h5>}

                </Card.Body>
            </Card>
        </div>
    )
}
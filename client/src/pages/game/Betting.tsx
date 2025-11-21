import { GamblingQuestion, ResponseBetData, ServerToClientMessage } from "@shared/schemas/game";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Alert, Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import { getWebsocket, sendWsMsg } from "./utils/websocket";

export function Betting() {
    const [question, setQuestion] = useState<GamblingQuestion>();
    const websocket = useRef<WebSocket>(undefined);

    const [responseIndex, setResponseIndex] = useState(0);
    const [amount, setAmount] = useState(0);
    const [tokens, setTokens] = useState(0);
    const [reconnectWsTries, reconnectWs] = useReducer((p) => p + 1, 0);

    const [betData, setBetData] = useState<ResponseBetData[]>([]);

    const [loading, setLoading] = useState<false | number>(false);

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
                        setBetData(() => msg.payload)
                        break;
                    case "userResponse":
                        setResponseIndex(() => msg.payload.responseIndex);
                        setAmount(() => msg.payload.amount);
                        setTokens(() => msg.payload.tokens);
                        setLoading(false);
                        break;
                    case "updateQuestion":
                        setQuestion(() => msg.payload)
                        break;
                }
            } catch (err) { };
        }

        return () => ws?.close();
    }, [reconnectWsTries]);

    useEffect(() => {
        if (amount == 0 && question?.match) {
            sendWsMsg(websocket.current, {
                type: "dropBet",
                payload: {
                    match: question.match
                }
            });
        } else {
            if (question === undefined) return;
            setLoading(Date.now());
            sendWsMsg(websocket.current, {
                type: "placeBet",
                payload: {
                    match: question.match,
                    amount,
                    responseIndex
                }
            });
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
        <div className="py-4">
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

            <Card className="w-75 w-md-50 mx-auto shadow-lg">
                <Card.Body className="text-center">
                    <h2 className="mb-3">Match {question.match}</h2>
                    {question.locked && <h5 className="text-muted">Betting has ended.</h5>}
                    <hr />
                    <h4 className="mb-4">{question.question}</h4>

                    <div className="d-flex flex-column gap-3 w-100 justify-content-center mb-4">
                        {question.responses.map((r, i) => (
                            <div key={i} className="d-flex gap-3 align-items-center justify-content-center">
                                <Button
                                    disabled={!question || question.locked}
                                    onClick={() => setResponseIndex(i)}
                                    variant={i === responseIndex ? "success" : "outline-secondary"}
                                    className="px-2"
                                    style={{ minWidth: "65px" }}
                                >
                                    {r}
                                </Button>
                                <h5 className="mb-0 text-muted">
                                    <strong>{(betData[i]?.percent || 0) * 100}%</strong> — $
                                    {betData[i]?.totalBet ?? 0}
                                </h5>
                            </div>
                        ))}
                    </div>

                    <hr />

                    <div className="d-flex justify-content-center mb-2">
                        <InputGroup style={{ maxWidth: "200px" }}>
                            <InputGroup.Text>
                                {(loading && Date.now() - loading > 500) ? (
                                    <Spinner size="sm" />
                                ) : (
                                    "$"
                                )}
                            </InputGroup.Text>
                            <Form.Control
                                disabled={!question || question.locked}
                                type="number"
                                min={0}
                                max={tokens}
                                value={amount.toString()}
                                onChange={(e) =>
                                    setAmount(Math.min(Math.max(parseInt(e.target.value) || 0, 0), tokens))
                                }
                            />
                        </InputGroup>
                    </div>
                    
                    {!question.locked && <small className="text-muted">(You have ${tokens} to spend)</small>}

                    {maxPayout !== undefined && (
                        <h5 className="mt-3 text-success">
                            Maximum payout: ${maxPayout.toLocaleString()}
                        </h5>
                    )}
                </Card.Body>
            </Card>
        </div>
    );

}
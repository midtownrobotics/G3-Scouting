import { Timer as TimerComponent } from "@shared/forms/FormComponents";
import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useStopwatch } from 'react-timer-hook';

export default function Timer({
    component,
    onChange,
}: {
    component: TimerComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

    const [locked, setLocked] = useState(false);

    const pauseAndUpdate = () => {
        onChange(component.getId(), `${totalSeconds}.${milliseconds}`);
        pause();
    }

    const lock = () => {
        setLocked(true);
        reset();
        pause();
        onChange(component.getId(), "");
    }

    const {
        totalSeconds,
        milliseconds,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false, interval: 20 });

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <div
                    className="text-center fw-bold fs-4"
                    style={{ minWidth: "120px", backgroundColor: "white", borderRadius: "5px" }}
                >
                    {locked && "0.0s"} {!locked && `${totalSeconds}.${milliseconds}s`}
                </div>
                <Button
                    variant={isRunning ? "danger" : "success"}
                    style={{ width: "60px" }}
                    onClick={() => isRunning ? pauseAndUpdate() : start()}
                    disabled={locked}
                >
                    {isRunning ? <Pause /> : <Play />}
                </Button>
                <Button
                    variant="danger"
                    onClick={lock}
                    disabled={locked}
                >
                    Nullify Data
                </Button>
            </div>
        </Form.Group>
    );
}
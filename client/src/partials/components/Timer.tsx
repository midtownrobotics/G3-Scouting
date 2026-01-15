import { Timer as TimerComponent } from "@shared/forms/FormComponents";
import { Pause, Play } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useStopwatch } from 'react-timer-hook';

export default function Timer({
    component,
    onChange,
    value,
}: {
    component: TimerComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

    const pauseAndUpdate = () => {
        onChange(component.getId(), `${totalSeconds}.${milliseconds}`);
        pause();
    }

    const {
        totalSeconds,
        milliseconds,
        seconds,
        minutes,
        hours,
        days,
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
                    style={{ minWidth: "120px" }}
                >
                    {totalSeconds}.{milliseconds}s
                </div>
                <Button
                    variant={isRunning ? "danger" : "success"}
                    style={{ width: "100px" }}
                    onClick={() => isRunning ? pauseAndUpdate() : start()}
                >
                    {isRunning ? <Pause /> : <Play />}
                </Button>
            </div>
        </Form.Group>
    );
}
import { useEffect, useState } from "react";
import { formatTime } from "./PitMonitor";

interface CountdownProps {
    targetDate: Date;
    backup?: string;
    prefix?: string;
}

export default function Countdown({ targetDate, backup, prefix }: CountdownProps) {
    const getTimeLeftString = () => {
        const now = Date.now();
        const diff = targetDate.getTime() - now;

        if (diff <= 0) return backup ?? `${prefix ?? ""}00:00`;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const pad = (n: number) => n.toString().padStart(2, "0");

        if (hours === 0) return `${prefix ?? ""}${pad(minutes)}:${pad(seconds)}`;
        return `${prefix ?? ""}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeftString);

    useEffect(() => {
        const now = Date.now();
        const diff = targetDate.getTime() - now;

        if (diff >= 3600000) {
            setTimeLeft(formatTime(targetDate.getTime()));
            return;
        }

        // update immediately if targetDate/props change
        setTimeLeft(getTimeLeftString());

        const timer = setInterval(() => {
            setTimeLeft(getTimeLeftString());
        }, 300);

        return () => clearInterval(timer);
    }, [targetDate]);

    return <span>{timeLeft}</span>;
}
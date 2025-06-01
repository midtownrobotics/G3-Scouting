import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Plus, Trash } from "react-bootstrap-icons";
import { DateString, Day, TimeString } from "./types";
import { toTimeMins, toTimeString } from "./utils";

function DaySelector({ days, setDays }: { days: Day[], setDays: (days: Day[]) => void }) {
    const [newDate, setNewDate] = useState<DateString>()
    const [newStart, setNewStart] = useState("00:00" as TimeString)
    const [newEnd, setNewEnd] = useState("00:00" as TimeString)

    const newDay = () => {
        if (!newDate) return alert("Please select a date.")
        if (days.some(d => d.date == newDate)) return alert("Dates cannot be repeated.");
        if (toTimeMins(newStart) >= toTimeMins(newEnd)) return alert("Start time must be eariler than end time.");
        setDays([...days, { date: newDate, start: toTimeMins(newStart), end: toTimeMins(newEnd) }])

        setNewStart("00:00" as TimeString);
        setNewEnd("00:00" as TimeString);
    }

    const removeDay = (date: string) => {
        setDays(days.filter(d => d.date !== date));
    }

    const setTimeValue = (val: string, setter: (value: TimeString) => void) => {
        const [hourStr, minuteStr] = val.split(':');
        const minute = parseInt(minuteStr, 10);
        const formatted = `${hourStr}:${String(minute < 30 ? 0 : 30).padStart(2, '0')}` as TimeString;
        setter(formatted);
    }

    return (
        <table>
            <tbody>
                <tr>
                    {days.map((d, di) => {
                        return (
                            <td key={di}>
                                <Form.Control type="date" disabled value={d.date} />
                                <Form.Control type="time" disabled value={toTimeString(d.start)} />
                                <Form.Control type="time" disabled value={toTimeString(d.end)} />
                                <Button type="button" variant="light" onClick={() => removeDay(d.date)}><Trash /></Button>
                            </td>
                        )
                    })}
                    <td>
                        <div id="newDay">
                            <Form.Control onChange={(e) => setNewDate(e.target.value as DateString)} type="date" />
                            <Form.Control type="time" step="1800" value={newStart} onChange={(e) => setTimeValue(e.target.value, setNewStart)} />
                            <Form.Control type="time" step="1800" value={newEnd} onChange={(e) => setTimeValue(e.target.value, setNewEnd)} />
                            <Button type="button" variant="light" onClick={newDay}><Plus /></Button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default DaySelector;
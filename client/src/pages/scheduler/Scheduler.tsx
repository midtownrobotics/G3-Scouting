import { Assignment, Block, SendableSchedule, UserScheduleData } from "@shared/schemas/schedule";
import { SimpleUser } from "@shared/schemas/user";
import { Day } from "@shared/types";
import { useEffect, useRef, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { fetchAPIJSON, postAPI } from "../../API";
import Assignments from "./Assignments";
import DaySelector from "./DaySelector";
import "./Scheduler.css";
import ScheduleTable from "./ScheduleTable";
import { toFormattedTime } from "./utils";
import { DocsLink } from "../../Utils";

function Scheduler() {
    const [users, setUsers] = useState<SimpleUser[]>([]);

    useEffect(() => {
        fetchAPIJSON("/admin/getUsers", SimpleUser.array()).then(res => {
            if (res) {
                setUsers(res);
            }
        });
    }, []);

    /** Maps user ids to a map of times to assignments. */
    const userBlockMapRef = useRef(new Map<number, Map<number, number>>());

    useEffect(() => {
        for (const user of users) {
            if (!userBlockMapRef.current.has(user.id)) {
                userBlockMapRef.current.set(user.id, new Map<number, number>());
            }
        }
    }, [users]);

    const [status, setStatus] = useState<string>();
    const [error, setError] = useState(false);
    const [saving, setSaving] = useState(false);

    const [selectedAssignment, setSelectedAssignment] = useState<number>();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [days, _setDays] = useState<Day[]>([]);
    const setDays = (days: Day[]) => {
        _setDays(days);
        const newBlocks: Block[] = [];
        days.forEach(d => {
            let time = d.start;
            const end = d.end;
            while (time <= end) {
                newBlocks.push({
                    date: d.date,
                    time: time,
                    id: new Date(`${d.date} ${toFormattedTime(time)}`).getTime()
                });
                time += 30;
            }
        });

        // This disgusting section of code removes all blocks from userBlockMapRef that no longer exist. There is probably a better way to do this.
        const firstEntry = userBlockMapRef.current.entries().next().value;
        if (firstEntry) {
            firstEntry[1].forEach((_v, k) => {
                if (newBlocks.every(b => b.id !== k)) {
                    userBlockMapRef.current.forEach(x => x.delete(k));
                }
            });
        }

        setBlocks(newBlocks);
    };

    useEffect(() => {
        fetchAPIJSON("/blocks", Block.array()).then(blocks => {
            if (!blocks) return;
            setBlocks(blocks);

            const newDays: Map<string, Day> = new Map();
            for (const block of blocks) {
                if (newDays.has(block.date)) {
                    const day = newDays.get(block.date)!;
                    if (day?.start === undefined) day.start = block.time;
                    day.end = block.time;
                } else {
                    newDays.set(block.date, {
                        date: block.date,
                        start: block.time,
                        end: block.time
                    });
                }
            }

            _setDays(Array.from(newDays.values()));
        });

        fetchAPIJSON("/assignments", Assignment.array()).then(assignments => {
            if (!assignments) return;
            setAssignments(assignments);
        });

        fetchAPIJSON("/schedules", UserScheduleData.array()).then(usersData => {
            if (!usersData) return;

            const userBlockMap = new Map<number, Map<number, number>>();

            for (const userData of usersData) {
                const blockMap = new Map<number, number>();

                for (const { block, assignment } of userData.schedule) {
                    blockMap.set(block.id, assignment.id);
                }

                userBlockMap.set(userData.id, blockMap);
            }

            userBlockMapRef.current = userBlockMap;
        });
    }, []);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (/^[1-9]$/.test(e.key)) {
                if ((parseInt(e.key) - 1) >= assignments.length) return;
                setSelectedAssignment(parseInt(e.key) - 1);
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [assignments]);

    const deploySchedules = () => {
        setSaving(true);

        // Converts map into an array. Maps cannot be JSON.stringify()ed.
        const schedules: SendableSchedule[] = [];
        for (const [userId, blockMap] of userBlockMapRef.current) {
            const assignments = Array.from(blockMap.entries()).map(([blockId, assignmentId]) => ({
                blockId,
                assignmentId
            }));

            if (assignments.length !== blocks.length) {
                setStatus("Every user must have an assignment for every block!");
                setError(true);
                setTimeout(() => setStatus(undefined), 4000);
                return setSaving(false);
            }

            schedules.push({
                userId,
                assignments
            });
        }

        postAPI("/admin/deploySchedule", {
            assignments,
            blocks,
            schedules
        }).then(r => {
            if (r?.status == 200) {
                setStatus("Schedule saved successfully!");
                setError(false);
            } else {
                setStatus("Error saving schedule...");
                setError(true);
            }
            setSaving(false);
            setTimeout(() => setStatus(undefined), 4000);
        });
    };

    return (
        <div id="scheduler" className="text-center mt-3">
            <div className="d-flex gap-2">
                <h1 className="ms-1" style={{ textAlign: "left" }}>Scheduler</h1>
                <DocsLink link="/docs/scheduling" />
            </div>
            <DaySelector setDays={setDays} days={days} />
            <br />
            <Assignments assignments={{ setAssignments, assignments, setSelectedAssignment, selectedAssignment }} />
            <br />
            <ScheduleTable userBlockMapRef={userBlockMapRef} users={users} assignmentIndex={selectedAssignment} blocks={blocks} assignments={assignments} />
            <Button
                id="deployButton"
                className={`w-50 mt-3 w-sm-auto px-4 py-2 ${status === undefined ? "mb-5" : ""}`}
                variant="primary"
                onClick={deploySchedules}
                disabled={saving}
            >Save Schedule</Button>
            {status !== undefined &&
                <Alert
                    variant={error ? "danger" : "success"}
                    className="w-50 mx-auto my-2 p-2 mb-0 mt-1"
                >{status}</Alert>
            }
        </div>
    );
}

export default Scheduler;
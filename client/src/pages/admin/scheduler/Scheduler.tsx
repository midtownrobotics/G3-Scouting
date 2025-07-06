import { useEffect, useRef, useState } from "react";
import { Day } from "@shared/types";
import { Assignment, Block, SendableSchedule } from "@shared/schemas/schedule";
import DaySelector from "./DaySelector"
import "./Scheduler.css"
import Assignments from "./Assignments";
import { SimpleUser } from "@shared/schemas/API";
import { postAPI } from "../../../API";
import ScheduleTable from "./ScheduleTable";
import { toFormattedTime } from "./utils";
import { Button } from "react-bootstrap";

function Scheduler({ users }: { users: SimpleUser[] }) {
    /** Maps user ids to a map of times to assignments. */
    const userBlockMapRef = useRef(new Map<number, Map<number, number>>())

    useEffect(() => {
        for (const user of users) {
            if (!userBlockMapRef.current.has(user.id)) {
                userBlockMapRef.current.set(user.id, new Map<number, number>());
            }
        }
    }, [users])

    const [selectedAssignment, setSelectedAssignment] = useState<number>()
    const [assignments, setAssignmentsState] = useState<Assignment[]>(JSON.parse(localStorage.getItem("assignments") || "[]"))
    const setAssignments = (a: Assignment[]) => {
        localStorage.setItem("assignments", JSON.stringify(a))
        setAssignmentsState(a);
    }

    const [blocks, setBlocksState] = useState<Block[]>(JSON.parse(localStorage.getItem("blocks") || "[]"));
    const setBlocks = (blocks: Block[]) => {
        localStorage.setItem("blocks", JSON.stringify(blocks))
        setBlocksState(blocks)
    }

    const [days, setDaysState] = useState<Day[]>(JSON.parse(localStorage.getItem("days") || "[]"));
    const setDays = (days: Day[]) => {
        localStorage.setItem("days", JSON.stringify(days))
        setDaysState(days);
        const newBlocks: Block[] = [];
        days.forEach(d => {
            let time = d.start;
            const end = d.end
            while (time <= end) {
                newBlocks.push({
                    date: d.date,
                    time: time,
                    id: new Date(`${d.date} ${toFormattedTime(time)}`).getTime()
                })
                time += 30;
            }
        })

        // This disgusting section of code removes all blocks from userBlockMapRef that no longer exist. There is probably a better way to do this.
        const firstEntry = userBlockMapRef.current.entries().next().value;
        if (firstEntry) {
            firstEntry[1].forEach((_v, k) => {
                if (newBlocks.every(b => b.id !== k)) {
                    userBlockMapRef.current.forEach(x => x.delete(k));
                }
            });
        }

        setBlocks(newBlocks)
    }

    const deploySchedules = () => {
        if (!confirm("Are you sure you want to deploy this schedule. This will RESET the current schedule.") || prompt(`Please type "DEPLOY" in the box below to confirm.`) !== "DEPLOY") return alert("Schedule NOT deployed.");

        // Converts map into an array. Maps cannot be JSON.stringify()ed.
        const schedules: SendableSchedule[] = Array.from(userBlockMapRef.current.entries()).map(([userId, blockMap]) => {
            const assignments = Array.from(blockMap.entries()).map(([blockId, assignmentId]) => ({
                blockId,
                assignmentId
            }))

            if (assignments.length !== blocks.length) {
                alert("Every user must have an assignment for every block!")
                throw new Error("Every user must have an assignment for every block");
            }

            return ({
                userId,
                assignments
            })
        });

        postAPI("/admin/deploySchedule", {
            assignments,
            blocks,
            schedules
        }).then(r => {
            if (r?.status == 200) {
                alert("Schedule deployed.")
            } else {
                alert("Error deploying schedule.")
            }
        })
    }

    return (
        <div id="scheduler">
            <h2>Scheduler</h2>
            <DaySelector setDays={setDays} days={days} />
            <br />
            <Assignments assignments={{ setAssignments, assignments, setSelectedAssignment, selectedAssignment }} />
            <br />
            <ScheduleTable userBlockMapRef={userBlockMapRef} users={users} assignmentIndex={selectedAssignment} blocks={blocks} assignments={assignments} />
            <Button variant="danger" style={{ width: "20%" }} onClick={deploySchedules}>Deploy Schedule</Button>
        </div>
    )
}

export default Scheduler;
import { useEffect, useState } from "react";
import { Assignment, Block, Day } from "./types";
import DaySelector from "./DaySelector"
import "./Scheduler.css"
import Assignments from "./Assignments";
import { SimpleUser, SimpleUserSchema } from "@shared/schemas/API";
import { fetchAPIJSON } from "../../../API";
import { z } from "zod";
import ScheduleTable from "./ScheduleTable";
import { toFormattedTime } from "./utils";

function Scheduler() {
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment>()
    const [assignments, setAssignmentsState] = useState<Assignment[]>(JSON.parse(localStorage.getItem("assignments") || "[]"))
    const setAssignments = (assignments: Assignment[]) => {
        localStorage.setItem("assignments", JSON.stringify(assignments))
        setAssignmentsState(assignments);
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
                    day: d,
                    time: time,
                    id: new Date(`${d.date} ${toFormattedTime(time)}`).getTime()
                })
                time += 30;
            }
        })
        setBlocks(newBlocks)
    }

    const [users, setUsers] = useState<SimpleUser[]>([])

    useEffect(() => {
        fetchAPIJSON("/admin/getUsers").then(u => {
            const parsed = z.array(SimpleUserSchema).safeParse(u)
            if (parsed.success && parsed.data) {
                setUsers(parsed.data)
            }
        })
    }, [])

    return (
        <div id="scheduler">
            <h2>Scheduler</h2>
            <DaySelector setDays={setDays} days={days} />
            <br />
            <Assignments assignments={{setAssignments, assignments, setSelectedAssignment, selectedAssignment}} />
            <br />
            <ScheduleTable users={users} assignment={selectedAssignment} blocks={blocks} />
        </div>
    )
}

export default Scheduler;
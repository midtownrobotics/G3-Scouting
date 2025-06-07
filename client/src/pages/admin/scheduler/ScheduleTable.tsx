import { SimpleUser } from "@shared/schemas/API";
import { Assignment, Block } from "./types";
import { Table } from "react-bootstrap";
import { toFormattedTime } from "./utils";
import UserRow from "./UserRow";
import { useEffect, useRef, useState } from "react";

function ScheduleTable({ users, assignment, blocks }: { users: SimpleUser[], assignment?: Assignment, blocks: Block[] }) {
    /** Maps user ids to a map of times to assignments. */
    const userBlockMapRef = useRef(new Map<number, Map<number, Assignment>>())
    /** Maps cell ids to an object with the coordinated block and user. */
    const cellIdsMapRef = useRef(new Map<string, { uId: number, bId: number }>)

    useEffect(() => {
        for (const user of users) {
            if (!userBlockMapRef.current.has(user.id)) {
                userBlockMapRef.current.set(user.id, new Map<number, Assignment>());
            }
        }
    }, [users])

    const [_, setBump] = useState(0)
    const forceReload = () => setBump(prev => prev + 1)

    const [selecting, setSelecting] = useState(false);
    const selectedCellRange = useRef([[-1, -1], [-1, -1]])

    const cellMouseHandler = (cellIndex: [number, number], mouseUpEvent: boolean) => {
        selectedCellRange.current[mouseUpEvent ? 1 : 0] = cellIndex;

        if (!mouseUpEvent) setCurrentMousePosition(cellIndex);

        if (mouseUpEvent) {
            const [start, end] = selectedCellRange.current;
            const rowMin = Math.min(start[0], end[0]);
            const rowMax = Math.max(start[0], end[0]);
            const colMin = Math.min(start[1], end[1]);
            const colMax = Math.max(start[1], end[1]);
    
            for (let i = rowMin; i <= rowMax; i++) {
                for (let x = colMin; x <= colMax; x++) {
                    const ids = cellIdsMapRef.current.get(`${i}-${x}`);
                    if (ids && assignment) {
                        userBlockMapRef.current.get(ids.uId)?.set(ids.bId, assignment);
                    }
                }
            }

            selectedCells.current.length = 0;
        };
        
        setSelecting(!mouseUpEvent);
    }

    /** List of selected cells by id in form `row-col`. Ex: `["0-0", "0-1"]` */
    const selectedCells = useRef<string[]>([]);

    const setCurrentMousePosition = (position: [number, number]) => {
        if (selecting) {
            selectedCells.current.length = 0;

            const start = selectedCellRange.current[0];
            const end = position;
            const rowMin = Math.min(start[0], end[0]);
            const rowMax = Math.max(start[0], end[0]);
            const colMin = Math.min(start[1], end[1]);
            const colMax = Math.max(start[1], end[1]);
    
            for (let i = rowMin; i <= rowMax; i++) {
                for (let x = colMin; x <= colMax; x++) {
                    selectedCells.current.push(`${i}-${x}`);
                }
            }

            forceReload();
        }
    }

    return (
        <Table bordered>
            <thead>
                <tr>
                    <td></td>
                    {Array.from(
                        blocks.reduce((map, block) => {
                            const date = block.day.date;
                            map.set(date, (map.get(date) || 0) + 1);
                            return map;
                        }, new Map<string, number>())
                    ).map(([date, count], i) => (
                        <td key={i} colSpan={count}>{date}</td>
                    ))}
                </tr>
                <tr>
                    <td></td>
                    {blocks.map((b, bi) => <td key={bi}>{toFormattedTime(b.time)}</td>)}
                </tr>
            </thead>
            <tbody>
                {users.map((u, ui) => (
                    <UserRow
                        key={ui}
                        cellMouseHandler={cellMouseHandler}
                        index={ui}
                        user={u}
                        blocks={blocks}
                        userBlockMapRef={userBlockMapRef}
                        cellIdsMapRef={cellIdsMapRef} 
                        setCurrentMousePosition={setCurrentMousePosition}
                        selectedCells={selectedCells}
                        selectedAssignment={assignment}                 
                    />
                ))}
            </tbody>
        </Table>
    )
}

export default ScheduleTable;
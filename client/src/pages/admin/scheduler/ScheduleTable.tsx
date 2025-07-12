import { SimpleUser } from "@shared/schemas/API";
import { Assignment, Block } from "@shared/schemas/schedule";
import { useRef, useState } from "react";
import { Table } from "react-bootstrap";
import UserRow from "./UserRow";
import { toFormattedTime } from "./utils";
import useEdgeAutoScroll from "./autoScroll";

function ScheduleTable({
    userBlockMapRef,
    users,
    assignmentIndex,
    blocks,
    assignments
}: {
    userBlockMapRef: React.RefObject<Map<number, Map<number, number>>>,
    users: SimpleUser[],
    assignmentIndex?: number,
    blocks: Block[],
    assignments: Assignment[]
}) {
    /** Maps cell ids to an object with the coordinated block and user. */
    const cellIdsMapRef = useRef(new Map<string, { uId: number, bId: number }>)

    const [_, setBump] = useState(0)
    const forceReload = () => setBump(prev => prev + 1)

    const [selecting, setSelecting] = useState(false);
    const selectedCellRange = useRef([[-1, -1], [-1, -1]])

    const cellMouseHandler = (cellIndex: [number, number], mouseUpEvent: boolean) => {
        selectedCellRange.current[mouseUpEvent ? 1 : 0] = cellIndex;

        if (!mouseUpEvent) setCurrentMousePosition(cellIndex, true);

        if (mouseUpEvent) {
            const [start, end] = selectedCellRange.current;
            const rowMin = Math.min(start[0], end[0]);
            const rowMax = Math.max(start[0], end[0]);
            const colMin = Math.min(start[1], end[1]);
            const colMax = Math.max(start[1], end[1]);

            for (let i = rowMin; i <= rowMax; i++) {
                for (let x = colMin; x <= colMax; x++) {
                    const ids = cellIdsMapRef.current.get(`${i}-${x}`);
                    if (ids && typeof assignmentIndex === "number") {
                        userBlockMapRef.current.get(ids.uId)?.set(ids.bId, assignments[assignmentIndex].id);
                    }
                }
            }

            selectedCells.current.length = 0;
        };

        setSelecting(!mouseUpEvent)
    }

    /** List of selected cells by id in form `row-col`. Ex: `["0-0", "0-1"]` */
    const selectedCells = useRef<string[]>([]);

    const setCurrentMousePosition = (position: [number, number], selectingOverride?: boolean) => {
        if (selecting || selectingOverride) {

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

    const { containerRef, handleMouseMove, stopScroll } = useEdgeAutoScroll();

    return (
        <div
            className="table-responsive"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={stopScroll}
            style={{ overflowX: "auto", maxWidth: "100%", position: "relative" }}
        >
            <Table bordered style={{ marginBottom: 0 }}>
                <thead>
                    <tr>
                        <td></td>
                        {Array.from(
                            blocks.reduce((map, block) => {
                                const date = block.date;
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
                            selectedAssignment={assignmentIndex}
                            assignments={assignments}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ScheduleTable;
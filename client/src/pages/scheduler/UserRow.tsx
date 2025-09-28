import { SimpleUser } from "@shared/schemas/user";
import React, { useEffect } from "react";
import { Assignment, Block } from "@shared/schemas/schedule";

function UserRow(
    {
        user, blocks, index, userBlockMapRef, cellIdsMapRef, cellMouseHandler, setCurrentMousePosition, selectedCells, selectedAssignment, assignments
    }: {
        user: SimpleUser,
        blocks: Block[],
        index: number,
        userBlockMapRef: React.RefObject<Map<number, Map<number, number>>>,
        cellIdsMapRef: React.RefObject<Map<string, { uId: number, bId: number }>>,
        selectedCells: React.RefObject<string[]>,
        cellMouseHandler: (i: [number, number], up: boolean) => void,
        setCurrentMousePosition: (pos: [number, number]) => void,
        selectedAssignment?: number,
        assignments: Assignment[]
    }
) {
    useEffect(() => {
        blocks.forEach((b, bi) => {
            cellIdsMapRef.current.set(`${index}-${bi}`, { uId: user.id, bId: b.id });
        });
    }, [blocks, index, user.id, cellIdsMapRef]);

    return (
        <tr>
            <td className="sticky-col">{user.username}</td>
            {blocks.map((b, bi) => {
                const cellIndex: [number, number] = [index, bi];
                return (
                    <AssignmentCell
                        key={bi}
                        assignment={userBlockMapRef.current.get(user.id)?.get(b.id)}
                        mouseHandler={(up) => cellMouseHandler(cellIndex, up)}
                        index={cellIndex}
                        setCurrentMousePosition={setCurrentMousePosition}
                        selectedCells={selectedCells}
                        selectedAssignment={selectedAssignment}
                        assignments={assignments}
                    />
                );
            })}
        </tr>
    );
}

function AssignmentCell(
    { 
        assignment, 
        mouseHandler, 
        setCurrentMousePosition, 
        index,
        selectedCells,
        selectedAssignment,
        assignments
    }: { 
        assignment?: number,
        mouseHandler: (up: boolean) => void, 
        setCurrentMousePosition: (pos: [number, number]) => void, 
        index: [number, number],
        selectedCells: React.RefObject<string[]>,
        selectedAssignment?: number,
        assignments: Assignment[]
    }
) {
    const id = `${index[0]}-${index[1]}`;
    return (
        <td 
            onMouseUp={() => mouseHandler(true)} 
            onMouseDown={() => mouseHandler(false)} 
            onMouseEnter={() => setCurrentMousePosition(index)} 
            style={{ backgroundColor: (typeof selectedAssignment === "number") && selectedCells.current.includes(id) ? assignments[selectedAssignment].color : assignments.find(a => a.id == assignment)?.color, cursor: "pointer" }}
        />
    )
}

export default UserRow;
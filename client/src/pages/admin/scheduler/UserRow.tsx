import { SimpleUser } from "@shared/schemas/API";
import React, { useEffect } from "react";
import { Assignment, Block } from "./types";

function UserRow(
    {
        user, blocks, index, userBlockMapRef, cellIdsMapRef, cellMouseHandler, setCurrentMousePosition, selectedCells, selectedAssignment
    }: {
        user: SimpleUser,
        blocks: Block[],
        index: number,
        userBlockMapRef: React.RefObject<Map<number, Map<number, Assignment>>>,
        cellIdsMapRef: React.RefObject<Map<string, { uId: number, bId: number }>>,
        selectedCells: React.RefObject<string[]>,
        cellMouseHandler: (i: [number, number], up: boolean) => void,
        setCurrentMousePosition: (pos: [number, number]) => void,
        selectedAssignment?: Assignment
    }
) {
    useEffect(() => {
        blocks.forEach((b, bi) => {
            cellIdsMapRef.current.set(`${index}-${bi}`, { uId: user.id, bId: b.id });
        });
    }, [blocks, index, user.id, cellIdsMapRef]);

    return (
        <tr>
            <td>{user.username}</td>
            {blocks.map((b, bi) => {
                const cellIndex: [number, number] = [index, bi];
                return (
                    <AssignmentCell
                        key={bi}
                        assignment={() => userBlockMapRef.current.get(user.id)?.get(b.id)}
                        mouseHandler={(up) => cellMouseHandler(cellIndex, up)}
                        index={cellIndex}
                        setCurrentMousePosition={setCurrentMousePosition}
                        selectedCells={selectedCells}
                        selectedAssignment={selectedAssignment}
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
        selectedAssignment
    }: { 
        assignment: () => Assignment | undefined,
        mouseHandler: (up: boolean) => void, 
        setCurrentMousePosition: (pos: [number, number]) => void, 
        index: [number, number],
        selectedCells: React.RefObject<string[]>,
        selectedAssignment?: Assignment
    }
) {
    const id = `${index[0]}-${index[1]}`;
    return (
        <td 
            onMouseUp={() => mouseHandler(true)} 
            onMouseDown={() => mouseHandler(false)} 
            onMouseEnter={() => setCurrentMousePosition(index)} 
            style={{ backgroundColor: selectedAssignment && selectedCells.current.includes(id) ? selectedAssignment.color : assignment()?.color, cursor: "pointer" }}
        />
    )
}

export default UserRow;
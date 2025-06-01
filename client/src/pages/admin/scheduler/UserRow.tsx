import { SimpleUser } from "@shared/schemas/API";
import React, { useState } from "react";
import { Assignment, Block } from "./types";

function UserRow({ user, assignment, blocks, userBlockMapRef }: { user: SimpleUser, assignment?: Assignment, blocks: Block[], userBlockMapRef: React.RefObject<Map<number, Map<number, Assignment>>>}) {
    return (
        <tr>
            <td>{user.username}</td>
            {blocks.map((b, bi) => <AssignmentCell key={bi} id={b.id} selectedAssignment={assignment} blockSetter={(id, a) => { userBlockMapRef.current.get(user.id)?.set(id, a); console.log(userBlockMapRef.current); }}></AssignmentCell>)}
        </tr>
    )
}

function AssignmentCell({ selectedAssignment, id, blockSetter }: {selectedAssignment?: Assignment, id: number, blockSetter: (id: number, assignment: Assignment) => void}) {
    const [assignment, setAssignmentState] = useState<Assignment>()
    const setAssignment = (assignment?: Assignment) => {
        setAssignmentState(assignment)
        if (assignment) {
            blockSetter(id, assignment)
        }
    }

    return (
        <td onClick={() => setAssignment(selectedAssignment)} style={{backgroundColor: assignment?.color, cursor: "pointer"}}></td>
    )
}

export default UserRow;
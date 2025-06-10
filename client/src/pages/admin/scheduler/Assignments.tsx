import { CheckCircle, Circle, Plus, Trash } from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { Assignment, AssignmentType } from "@shared/schemas/schedule";

function Assignments({ assignments: { assignments, setAssignments, selectedAssignment, setSelectedAssignment } }: { assignments: { assignments: Assignment[], setAssignments: (a: Assignment[]) => void, selectedAssignment?: number, setSelectedAssignment: (assignment: number) => void } }) {
    const [newColor, setNewColor] = useState<string>("#000000")
    const [newName, setNewName] = useState<string>()
    const [newType, setNewType] = useState<AssignmentType>(AssignmentType.BREAK)

    const removeAssignment = (id: number) => {
        const newAssignments = [...assignments].filter(a => a.id !== id);
        setAssignments(newAssignments);
        setSelectedAssignment(0);

        console.log(newAssignments, id)
    }

    const addAssignment = () => {
        if (!newColor || !newName) return alert("Please set a name.");
        setAssignments([...assignments, { id: Date.now(),color: newColor, name: newName, type: newType }])

        setNewColor("#000000")
        setNewName("")
    }

    return (
        <table>
            <tbody>
                <tr>
                    {assignments.map((a, ai) => {
                        return (
                            <td key={ai}>
                                <Form.Control disabled type="color" value={a.color} />
                                <Form.Control disabled type="text" value={a.name} />
                                <Form.Control disabled type="text" value={a.type} />
                                <Button className="halfButton" variant="light" onClick={() => removeAssignment(a.id)}><Trash /></Button>
                                <Button className="halfButton" variant="light" disabled={selectedAssignment === ai} onClick={() => setSelectedAssignment(ai)}>{selectedAssignment === ai ? <CheckCircle /> : <Circle />}</Button>
                            </td>
                        )
                    })}

                    <td id="newAssignment">
                        <Form.Control type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
                        <Form.Control type="text" value={newName} placeholder="Name" onChange={e => setNewName(e.target.value)} onKeyUp={e => { if (e.key == "Enter") addAssignment() }} />
                        <Form.Select style={{marginLeft: "2px"}} value={newType} onChange={e => setNewType(e.target.value as AssignmentType)}>
                            <option value={AssignmentType.BREAK}>{AssignmentType.BREAK}</option>
                            <option value={AssignmentType.SCOUTING}>{AssignmentType.SCOUTING}</option>
                        </Form.Select>
                        <Button variant="light" onClick={addAssignment}><Plus /></Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Assignments;
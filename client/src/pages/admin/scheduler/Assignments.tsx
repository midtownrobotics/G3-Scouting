import { CheckCircle, Circle, Plus, Trash } from "react-bootstrap-icons";
import { Assignment } from "./types";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

function Assignments({assignments: { assignments, setAssignments, selectedAssignment, setSelectedAssignment }}: {assignments: { assignments: Assignment[], setAssignments: (assignments: Assignment[]) => void , selectedAssignment?: Assignment, setSelectedAssignment: (assignment: Assignment) => void}}) {
    const [newColor, setNewColor] = useState<string>("#000000")
    const [newName, setNewName] = useState<string>()
 
    const removeAssignment = (id: number) => {
        setAssignments(assignments.filter(a => a.id !== id));
    }

    const addAssignment = () => {
        if (!newColor || !newName) return alert("Please set a name.");
        setAssignments([...assignments, { id: Math.max(...assignments.map(a => a.id), -1) + 1, color: newColor, name: newName }])

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
                                <Button className="halfButton" variant="light" onClick={() => removeAssignment(a.id)}><Trash /></Button>
                                <Button className="halfButton" variant="light" disabled={selectedAssignment?.id === a.id} onClick={() => setSelectedAssignment(a)}>{selectedAssignment?.id === a.id ? <CheckCircle /> : <Circle />}</Button>
                            </td>
                        )
                    })}

                    <td id="newAssignment">
                        <Form.Control type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
                        <Form.Control type="text" value={newName} placeholder="Name" onChange={e => setNewName(e.target.value)} onKeyUp={e => { if (e.key == "Enter") addAssignment() }} />
                        <Button variant="light" onClick={addAssignment}><Plus /></Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Assignments;
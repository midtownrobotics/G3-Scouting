import { Number as NumberComponent } from "@shared/forms/FormComponents";
import { Form } from "react-bootstrap";

export default function RobotRanking({
    component,
    onChange,
    teams
}: {
    component: NumberComponent;
    onChange: (id: string, value: string, team: number) => void;
    teams: number[];
}) {
    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            {[1, 2, 3].map(n =>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    #{n}
                    <select>
                        {teams.map(t => <option>{t}</option>)}
                    </select>
                </div>
            )}
        </Form.Group>
    );
}

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export default function TeamSelector({
    onChange,
    teams
}: {
    onChange: (val: number) => void,
    teams: number[]
}) {
    const [team, setTeam] = useState(teams[0]);
    useEffect(() => onChange(teams[0]), []);

    const updateValue = (val: string) => {
        setTeam(parseInt(val));
        onChange(parseInt(val));
    }

    return (
        <Form.Group className="my-3">
            <Form.Label>Team Number</Form.Label>
            <Form.Select
                className="w-100 mx-auto text-center"
                style={{ maxWidth: "150px" }}
                onChange={e => updateValue(e.target.value)}
                value={team}
            >
                {teams.map(t => 
                    <option value={t.toString()}>{t.toString()}</option>
                )}
            </Form.Select>
        </Form.Group>
    );
};
import { TeamNumber as TeamNumberComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function TeamNumber({
    component,
    onChange,
    value,
}: {
    component: TeamNumberComponent;
    onChange: (id: number, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, "");
    }, [value]);

    return (
        <Form.Group className="my-3">
            <Form.Label>Team Number</Form.Label>
            <Form.Control
                className="w-100 mx-auto text-center" 
                style={{ maxWidth: "300px" }}
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(component.id, e.target.value)}
                disabled
            />
        </Form.Group>
    );
}

import { MultipleChoice as MultipleChoiceComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function MultipleChoice({
    component,
    onChange,
    value,
}: {
    component: MultipleChoiceComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, component.choices[0]);
    }, [value]);

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <Form.Select
                className="w-100 mx-auto text-center" 
                style={{ maxWidth: "300px" }}
                value={value ?? ""}
                onChange={(e) => onChange(component.id, e.target.value)}
            >
                {component.choices.map((c, ci) => (
                    <option key={ci} value={c}>{c}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}

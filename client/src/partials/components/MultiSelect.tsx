import { MultiSelect as MultiSelectComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function MultiSelect({
    component,
    onChange,
    value,
}: {
    component: MultiSelectComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {
    // Default to empty string (no selections)
    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "");
    }, [value]);

    const selected = value ? value.split(",").filter(Boolean) : [];

    const toggle = (choice: string) => {
        const next = selected.includes(choice)
            ? selected.filter(c => c !== choice)
            : [...selected, choice];
        onChange(component.getId(), next.join(","));
    };

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <div className="d-flex flex-wrap gap-2">
                {component.choices.map((choice, i) => (
                    <Form.Check
                        key={i}
                        type="checkbox"
                        id={`${component.getId()}-${i}`}
                        label={choice}
                        checked={selected.includes(choice)}
                        onChange={() => toggle(choice)}
                    />
                ))}
            </div>
        </Form.Group>
    );
}
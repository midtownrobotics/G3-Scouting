import { BooleanInput as BooleanInputComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function BooleanInput({
    component,
    onChange,
    value,
    highlighting
}: {
    component: BooleanInputComponent;
    onChange: (id: string, value: string) => void;
    value: string;
    highlighting: boolean;
}) {
    useEffect(() => {
        if (!highlighting) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') onChange(component.getId(), value === "true" ? "false" : "true");
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [highlighting, value, onChange]);


    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "false");
    }, [value]);

    return (
        <div
            className="w-100 d-flex justify-content-center mt-3"
            onClick={() => onChange(component.getId(), String(value == "false"))}
        >
            <Form.Check
                label={component.question}
                checked={value == "true"}
            />
        </div>
    );
}

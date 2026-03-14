import { MultipleChoice as MultipleChoiceComponent } from "@shared/forms/FormComponents";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export default function MultipleChoice({
    component,
    onChange,
    value,
    highlighting
}: {
    component: MultipleChoiceComponent;
    onChange: (id: string, value: string) => void;
    value: string;
    highlighting: boolean;
}) {
    const [hotkeyIndex, setHotkeyIndex] = useState<number>();

    useEffect(() => {
        if (!highlighting) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                const updated = Math.max(Math.min((hotkeyIndex ?? 1) - 1, component.choices.length - 1), 0);
                onChange(component.getId(), component.choices[updated])
                setHotkeyIndex(updated);
            };
            if (e.key === 'ArrowRight') {
                const updated = Math.max(Math.min((hotkeyIndex ?? 0) + 1, component.choices.length - 1), 0);
                onChange(component.getId(), component.choices[updated])
                setHotkeyIndex(updated);
            };
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [highlighting, value, onChange]);


    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), component.choices[0]);
    }, [value]);

    return (
        <Form.Group className="my-3 form-component">
            <Form.Label>{component.question}</Form.Label>
            <Form.Select
                className="w-100 mx-auto text-center"
                style={{ maxWidth: "300px" }}
                value={value ?? ""}
                onChange={(e) => onChange(component.getId(), e.target.value)}
            >
                {component.choices.map((c, ci) => (
                    <option key={ci} value={c}>{c}</option>
                ))}
            </Form.Select>
        </Form.Group>
    );
}

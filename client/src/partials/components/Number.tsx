import { Number as NumberComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

export default function Number({
    component,
    onChange,
    value,
    highlighting
}: {
    component: NumberComponent;
    onChange: (id: string, value: string) => void;
    value: string;
    highlighting: boolean;
}) {
    useEffect(() => {
        if (!highlighting) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') onChange(component.getId(), (parseInt(value) - 1).toString());
            if (e.key === 'ArrowRight') onChange(component.getId(), (parseInt(value) + 1).toString());
            if (e.key === '/') onChange(component.getId(), (parseInt(value) + 10).toString());
            if (e.key === 'Shift') onChange(component.getId(), (parseInt(value) + 5).toString());
            if (e.key === '0') onChange(component.getId(), (0).toString());
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [highlighting, value, onChange]);

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "0");
    }, [value]);

    return (
        <Form.Group className="my-3 form-component">
            <Form.Label>{component.question}</Form.Label>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Button
                    variant="light"
                    style={{ width: "50px" }}
                    onClick={() => onChange(component.getId(), (parseInt(value) - 1).toString())}
                >-</Button>
                <Form.Control
                    className="text-center"
                    style={{ maxWidth: "180px" }}
                    type="text"
                    value={value ?? 0}
                    onChange={(e) => onChange(component.getId(), (parseInt(e.target.value) || 0).toString())}
                />
                <Button
                    variant="light"
                    style={{ width: "50px" }}
                    onClick={() => onChange(component.getId(), (parseInt(value) + 1).toString())}
                >+</Button>
                <Button
                    variant="light"
                    style={{ width: "50px" }}
                    onClick={() => onChange(component.getId(), (parseInt(value) + 5).toString())}
                >+5</Button>
            </div>
        </Form.Group>
    );
}

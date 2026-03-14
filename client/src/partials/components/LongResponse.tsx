import { ShortResponse as ShortResponseComponent } from "@shared/forms/FormComponents";
import { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

export default function LongResponse({
    component,
    onChange,
    value,
    highlighting
}: {
    component: ShortResponseComponent;
    onChange: (id: string, value: string) => void;
    value: string;
    highlighting: boolean;
}) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (highlighting) inputRef.current?.focus();
        else inputRef.current?.blur();
    }, [highlighting])

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "");
    }, [value]);

    return (
        <Form.Group className="my-3 form-component">
            <Form.Label>{component.question}</Form.Label>
            <Form.Control
                as="textarea"
                className="w-100 mx-auto"
                style={{ maxWidth: "70%", height: "150px" }}
                value={value ?? ""}
                onChange={(e) => onChange(component.getId(), e.target.value)}
                ref={inputRef}
            />
        </Form.Group>
    );
}

import { ShortResponse as ShortResponseComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function ShortResponse({
    component,
    onChange,
    value,
}: {
    component: ShortResponseComponent;
    onChange: (id: number, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, "");
    }, [value]);

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <Form.Control
                className="w-100 mx-auto text-center" 
                style={{ maxWidth: "300px" }}
                type="text"
                value={value ?? ""}
                onChange={(e) => onChange(component.id, e.target.value)}
            />
        </Form.Group>
    );
}

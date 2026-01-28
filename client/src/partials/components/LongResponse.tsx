import { ShortResponse as ShortResponseComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function LongResponse({
    component,
    onChange,
    value,
}: {
    component: ShortResponseComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "");
    }, [value]);

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <Form.Control
                as="textarea"
                className="w-100 mx-auto"
                style={{ maxWidth: "70%", height: "150px" }}
                value={value ?? ""}
                onChange={(e) => onChange(component.getId(), e.target.value)}
            />
        </Form.Group>
    );
}

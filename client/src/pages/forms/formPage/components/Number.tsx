import { Number as NumberComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

export default function Number({
    component,
    onChange,
    value,
}: {
    component: NumberComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, "0");
    }, [value]);

    return (
        <Form.Group className="my-3">
            <Form.Label>{component.question}</Form.Label>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Button
                    variant="light"
                    style={{width: "50px"}}
                    onClick={() => onChange(component.id, (parseInt(value)-1).toString())}
                >-</Button>
                <Form.Control
                    className="text-center"
                    style={{ maxWidth: "180px" }}
                    type="number"
                    value={value ?? 0}
                    onChange={(e) => onChange(component.id, e.target.value)}
                />
                <Button
                    variant="light"
                    style={{width: "50px"}}
                    onClick={() => onChange(component.id, (parseInt(value)+1).toString())}
                >+</Button>
            </div>
        </Form.Group>
    );
}

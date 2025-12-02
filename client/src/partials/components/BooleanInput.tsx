import { BooleanInput as BooleanInputComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function BooleanInput({
    component,
    onChange,
    value,
}: {
    component: BooleanInputComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {

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

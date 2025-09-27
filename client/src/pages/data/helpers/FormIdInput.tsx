import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { fetchAPIJSON } from "../../../API";

export default function FormIdInput({ onChange }: { onChange: (value: string) => void; }) {
    const [value, setValue] = useState<string>();
    const [forms, setForms] = useState<SerializedForm[]>();

    useEffect(() => {
        const form = new URLSearchParams(window.location.search).get("form");
        if (!form) return;
        onChange(form);
        setValue(form);
    }, []);

    useEffect(() => {
        fetchAPIJSON("/forms/getForms", SerializedForm.array()).then(res => {
            if (res) {
                setForms(res);
            }
        });
    }, []);

    const handleChange = (v: string) => {
        if (value === undefined) return;
        if (!forms?.map(f => f.id).includes(v)) return;
        setValue(v)
        onChange(value);

        const url = new URL(window.location.href);
        url.searchParams.set("form", value.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    };

    return (
        <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
            <Form.Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">-- Choose a form --</option>
                {forms?.map((f) => (
                    <option key={f.id} value={f.id}>
                        {f.name}
                    </option>
                ))}
            </Form.Select>
        </InputGroup>
    );
}
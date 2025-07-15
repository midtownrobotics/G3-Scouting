import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { z } from "zod";
import { fetchAPIJSON } from "../../API";

export default function FormIdInput({ onSubmit }: { onSubmit: (value: string) => void; }) {
    const [value, setValue] = useState<string>();
    const [forms, setForms] = useState<SerializedForm[]>();

    useEffect(() => {
        const form = new URLSearchParams(window.location.search).get("form");
        if (!form) return;
        onSubmit(form);
        setValue(form);
    }, []);

    useEffect(() => {
        fetchAPIJSON("/forms/getForms").then(u => {
            const parsed = z.array(SerializedForm).safeParse(u);
            if (parsed.success && parsed.data) {
                setForms(parsed.data);
            }
        });
    }, []);

    const handleSubmit = () => {
        if (value === undefined) return;
        onSubmit(value);

        const url = new URL(window.location.href);
        url.searchParams.set("form", value.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    };

    return (
        <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
            <Form.Select
                value={value}
                onChange={(e) => setValue(e.target.value)}
            >
                <option value="">-- Choose a form --</option>
                {forms?.map((f) => (
                    <option key={f.id} value={f.id}>
                        {f.name}
                    </option>
                ))}
            </Form.Select>
            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </InputGroup>
    );
}
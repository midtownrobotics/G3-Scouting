import { FormRowResponse } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { fetchAPIJSON } from "../../API";
import FormDataTable from "./FormDataTable";
import FormIdInput from "./FormIdInput";

export default function () {
    const [formRowResponse, setFormRowResponse] = useState<FormRowResponse>();
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (formId === undefined) return;
        fetchAPIJSON(`/data/getFormRows/${formId}`).then(data => {
            const parsed = FormRowResponse.safeParse(data);
            if (parsed.success) setFormRowResponse(parsed.data);
        });
    }, [formId]);

    if (!formRowResponse) {
        return (
            <div className="p-3">
                <h1>Form Data</h1>
                <br />
                <FormIdInput onSubmit={setFormId} />
            </div>
        );
    }

    return (
        <div className="p-3">
            <h1>Form Data</h1>
            <br />
            <FormIdInput onSubmit={setFormId} />
            <br />
            <FormDataTable formRowResponse={formRowResponse} />
        </div>
    );
}
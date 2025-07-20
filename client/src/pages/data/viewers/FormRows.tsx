import { FormResponseData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { fetchAPIJSON } from "../../../API";
import FormIdInput from "../helpers/FormIdInput";
import FormResponseTable from "../helpers/FormResponseTable";

export default function FormRows() {
    const [formResponseData, setFormResponseData] = useState<FormResponseData>();
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (formId === undefined) return;
        fetchAPIJSON(`/data/getFormData/${formId}`).then(data => {
            const parsed = FormResponseData.safeParse(data);
            if (parsed.success) setFormResponseData(parsed.data);
        });
    }, [formId]);

    if (!formResponseData) {
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
            <FormResponseTable formResponseData={formResponseData}/>
        </div>
    );
}
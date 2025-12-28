import { FormResponseData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { fetchAPIJSON } from "../../../API";
import FormIdInput from "../helpers/FormIdInput";
import FormResponseTable from "../helpers/FormResponseTable";

export default function FormRows({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [formResponseData, setFormResponseData] = useState<FormResponseData>();
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (formId === undefined) return;
        fetchAPIJSON(`/data/getFormData/${formId}/${accuracy}/${fromMatch}`, FormResponseData).then(res => {
            if (res) setFormResponseData(res);
        });
    }, [formId, accuracy, fromMatch]);

    if (!formResponseData) {
        return (
            <div className="p-3">
                <h1>Form Data</h1>
                <br />
                <FormIdInput onChange={setFormId} />
            </div>
        );
    }

    return (
        <div className="p-3">
            <h1>Form Data</h1>
            <br />
            <FormIdInput onChange={setFormId} />
            <br />
            <FormResponseTable formResponseData={formResponseData}/>
        </div>
    );
}
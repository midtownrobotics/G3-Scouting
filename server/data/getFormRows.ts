import Form from "@shared/forms/Form";
import { FormRowResponse } from "@shared/schemas/data";
import FormModel from "../models/forms/FormModel";

export default async function getFormRows(form: Form): Promise<FormRowResponse>;
export default async function getFormRows(formId: string): Promise<FormRowResponse | null>;
export default async function getFormRows(form: string | Form): Promise<FormRowResponse | null> {
    if (typeof form == "string") {
        const formModel = await FormModel.getForm(form, true);
        if (!formModel) return null;
        form = formModel;
    }
    const data = form.getResponseData();
    return { rows: data.responses, questions: data.questions };
}
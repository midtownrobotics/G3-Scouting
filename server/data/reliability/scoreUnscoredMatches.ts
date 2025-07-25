import Form from "@shared/forms/Form";
import { getAllMatches } from "../../externalApis/tba/tba";
import FormModel from "../../models/forms/FormModel";
import scoreAllianceData from "./scoreResponse";
import { renderProgress } from "../../utils";

export async function scoreAllForms() {
    console.log("Started scoring...");
    console.time("Finished scoring in");
    const matchNumbers = await getAllMatches();
    if (matchNumbers === false) return;

    const forms = await FormModel.getForms(true);
    for (const form of forms) {
        if (form.needsValidation) await scoreUnscoredMatches(form, matchNumbers);
    }
    console.timeEnd("Finished scoring in");
}

export async function scoreUnscoredMatches(form: Form, matchNumbers?: number[]): Promise<void>;
export async function scoreUnscoredMatches(form: Form, matchNumbers: number[] | false = false) {
    if (matchNumbers === undefined) matchNumbers = await getAllMatches();;
    if (matchNumbers === false) return;

    const formData = form.getResponseData();
    if (formData === null) return;

    for (const match of matchNumbers) {
        for (const alliance of ["red", "blue"] as const) {
            renderProgress(match * 2 + (alliance == "red" ? 0 : 1) - 1, matchNumbers.length * 2);
            await scoreAllianceData(match, alliance, formData);
        }
    }
}
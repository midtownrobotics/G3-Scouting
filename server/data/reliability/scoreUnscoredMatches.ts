import Form from "@shared/forms/Form";
import { getAllMatches } from "../../externalApis/tba/tba";
import FormModel from "../../models/forms/FormModel";
import scoreAllianceData from "./scoreResponse";

export async function scoreAllForms() {
    // console.log("Started scoring...");
    // console.time("Finished scoring in");
    const matchNumbers = (await getAllMatches())?.map(m => m.match_number);
    if (matchNumbers === undefined) return;

    const forms = await FormModel.getForms(true);
    for (const form of forms) {
        if (form.needsValidation) await scoreUnscoredMatches(form, matchNumbers);
    }
    // console.timeEnd("Finished scoring in");
}

export async function scoreUnscoredMatches(form: Form, matchNumbers?: number[]) {
    if (matchNumbers === undefined) matchNumbers = (await getAllMatches())?.map(m => m.match_number);
    if (matchNumbers === undefined) return;

    const formData = form.getResponseData();
    if (formData === null) return;

    for (const match of matchNumbers) {
        for (const alliance of ["red", "blue"] as const) {
            // renderProgress(match * 2 + (alliance == "red" ? 0 : 1) - 1, matchNumbers.length * 2);
            await scoreAllianceData(match, alliance, formData);
        }
    }
}
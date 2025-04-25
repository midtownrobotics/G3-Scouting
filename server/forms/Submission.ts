import UserModel from "../models/users/UserModel";
import { ResponseKeyValuePair } from "../types";
import { Form } from "./forms";

export default class Submission {
    public needsMatchData: boolean = false;

    constructor(form: Form, user: UserModel, responsePairs: ResponseKeyValuePair[]) {
        const questions = form.getQuestions();
        
        const dataToCreate: { [key: string]: string | number } = {};
        responsePairs.filter((p) => form.getQuestionIds().includes(p.name)).forEach((p) => dataToCreate[p.name] = p.value)

        dataToCreate.scout = user.username;
        dataToCreate.scoutId = user.id;
        dataToCreate.timestamp = new Date().toLocaleString();

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].getNeedsMatchData()) this.needsMatchData = true;
        }
    }
}
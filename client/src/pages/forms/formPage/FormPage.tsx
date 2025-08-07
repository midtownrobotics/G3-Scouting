import Form, { FormType } from "@shared/forms/Form";
import { QuestionResponse, SubmittedResponse } from "@shared/schemas/data";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { postAPI } from "../../../API";
import FormComp from "../../../partials/FormComp";
import { useUserData } from "../../../userData";
import './FormPage.css';

function FormPage({ form }: { form: React.RefObject<Form | null>; }) {
    const [answers, setAnswers] = useState(new Map<string, string>());
    const [submitting, setSubmitting] = useState(false);

    const { userData } = useUserData();
    const nextMatch = userData?.user.nextMatch;

    const handleAnswerChange = (componentId: string, value: string) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            newAnswers.set(componentId, value);
            return newAnswers;
        });
    };

    const submitForm = async () => {
        setSubmitting(true);

        if (!form.current) return submittingFail();
        if (!nextMatch) return submittingFail();

        let res: Response | null;

        if (form.current.type === FormType.ALLIANCE) {
            const teams = new Map<string, QuestionResponse[]>();
            for (const a of answers) {
                const [team, id] = a[0].split("##");
                if (!teams.has(team)) {
                    teams.set(team, []);
                }
                teams.get(team)?.push({ question: id, response: a[1] });
            }

            res = await postAPI("/forms/submitForm", {
                type: FormType.ALLIANCE,
                formId: form.current.id,
                teams: Array.from(teams).map(t => parseInt(t[0])),
                responses: Array.from(teams).map(r => ({
                    responses: r[1],
                    team: parseInt(r[0]),
                    formId: form.current?.id,
                    match: nextMatch.number
                })),
            } as SubmittedResponse);
        } else {
            res = await postAPI("/forms/submitForm", {
                type: FormType.TEAM,
                formId: form.current.id,
                response: {
                    responses: Array.from(answers).map(([question, response]) => ({ question, response })),
                    formId: form.current.id,
                    match: nextMatch.number,
                    team: nextMatch.team,
                }
            } as SubmittedResponse);
        }

        setSubmitting(false);

        if (res?.status !== 200) return submittingFail();

        setAnswers(new Map());
    };

    const submittingFail = () => {
        setSubmitting(false);
        alert("SUBMIT FAILED! CHECK INTERNET!");
    };

    if (!form.current) return (<h1>This is not possible...</h1>);

    return (
        <div id="form-page">
            <h1>{form.current.name}</h1>

            <FormComp
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                form={form.current}
                match={nextMatch?.number}
                team={nextMatch?.team}
                teams={nextMatch?.teams}
            />

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
        </div>
    );
}

export default FormPage;
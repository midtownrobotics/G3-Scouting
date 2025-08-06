import Form, { FormType } from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import { QuestionResponse, SubmittedResponse } from "@shared/schemas/data";
import React, { useState } from "react";
import { Form as BSForm, Button, Spinner } from "react-bootstrap";
import { postAPI } from "../../../API";
import DisabledInput from "../../../partials/components/DisabledInput";
import FormComponent from "../../../partials/components/FormComponent";
import SectionBreak from "../../../partials/components/SectionBreak";
import './FormPage.css';
import { useUserData } from "../../../userData";

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

    return (
        <div id="form-page">
            <h1>{form.current?.name}</h1>

            {form.current?.type === FormType.TEAM ? (
                <BSForm>
                    <SectionBreak component={new formComponents.SectionBreak("Pre-game")} />
                    <DisabledInput val={nextMatch?.number}>Match Number</DisabledInput>
                    <DisabledInput val={nextMatch?.team}>Team Number</DisabledInput>
                    {form.current?.getComponents().map(c => (
                        <FormComponent
                            key={c.getId()}
                            component={c}
                            onAnswerChange={handleAnswerChange}
                            answer={answers.get(c.getId())}
                        />
                    ))}
                </BSForm>
            ) : (
                <BSForm>
                    <hr />
                    <DisabledInput val={nextMatch?.number}>Match Number</DisabledInput>
                    {nextMatch?.teams.map(t => (
                        <div>
                            <hr />
                            <h2>Team #{t}</h2>
                            {form.current?.getComponents().map(c => (
                                <FormComponent
                                    key={t + "##" + c.getId()}
                                    team={t}
                                    component={c}
                                    onAnswerChange={handleAnswerChange}
                                    answer={answers.get(t + "##" + c.getId())}
                                />
                            ))}
                        </div>
                    ))}
                </BSForm>
            )}

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
        </div>
    );
}

export default FormPage;
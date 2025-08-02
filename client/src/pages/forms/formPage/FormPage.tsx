import Form from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import React, { useState } from "react";
import { Form as BSForm, Button, Spinner } from "react-bootstrap";
import { postAPI } from "../../../API";
import './FormPage.css';
import DisabledInput from "../../../partials/components/DisabledInput";
import SectionBreak from "../../../partials/components/SectionBreak";
import FormComponent from "../../../partials/components/FormComponent";

function FormPage({ form }: { form: React.RefObject<Form | null>; }) {
    const [answers, setAnswers] = useState(new Map<string, string>());
    const [submitting, setSubmitting] = useState(false);
    const [match, setMatch] = useState(99); // TODO
    const [team, setTeam] = useState(9999); // TODO

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

        const res = await postAPI("/forms/submitForm", {
            responses: Array.from(answers).map(([question, response]) => ({ question, response })),
            formId: form.current.id,
            match,
            team
        });

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
            <BSForm>
                <SectionBreak component={new formComponents.SectionBreak("Pre-game")} />
                <DisabledInput val={match}>Match Number</DisabledInput>
                <DisabledInput val={team}>Team Number</DisabledInput>
                {form.current?.getComponents().map(c => (
                    <FormComponent
                        key={c.getId()}
                        component={c}
                        onAnswerChange={handleAnswerChange}
                        answer={answers.get(c.getId())}
                    />
                ))}
            </BSForm>

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
        </div>
    );
}

export default FormPage;
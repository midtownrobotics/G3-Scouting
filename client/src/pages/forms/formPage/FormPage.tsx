import Form from "@shared/forms/Form";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import './FormPage.css';
import FormComponent from "./components/FormComponent";
import { postAPI } from "../../../API";

function FormPage({ form }: { form: React.RefObject<Form | null> }) {
    const [answers, setAnswers] = useState(new Map<number, string>());
    const [submitting, setSubmitting] = useState(false);

    const handleAnswerChange = (componentId: number, value: string) => {
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
            response: Array.from(answers),
            form: form.current.id
        })

        setSubmitting(false);

        if (res?.status !== 200) return submittingFail();

        setAnswers(new Map())
    }

    const submittingFail = () => {
        setSubmitting(false);
        alert("SUBMIT FAILED! CHECK INTERNET!");
    }

    return (
        <div id="form-page">
            <h1>{form.current?.name}</h1>
            {form.current?.getComponents().map(c => (
                <FormComponent
                    key={c.id}
                    component={c}
                    onAnswerChange={handleAnswerChange}
                    answer={answers.get(c.id)}
                />
            ))}

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
        </div>
    )
}

export default FormPage;
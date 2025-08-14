import Form from "@shared/forms/Form";
import { useEffect, useRef, useState } from "react";
import { fetchAPIJSON } from "../../API";
import { SerializedForm } from "@shared/schemas/forms";
import MainPage from "./mainPage/MainPage";
import FormPage from "./formPage/FormPage";
import { Spinner } from "react-bootstrap";

function Forms() {
    const [formId, setFormId] = useState<string>();
    const form = useRef<Form | null>(null);
    const [mainPage, setMainPage] = useState(true);
    const [loadingForm, setLoadingForm] = useState(false);

    useEffect(() => {
        const formIdParam = new URLSearchParams(window.location.search).get("form");
        if (formIdParam) setFormId(formIdParam);
    }, []);

    useEffect(() => {
        if (!formId) return;

        const url = new URL(window.location.href);
        url.searchParams.set("form", formId);
        window.history.pushState({}, "", url.toString());

        setLoadingForm(true);

        fetchAPIJSON(`/forms/getForm/${formId}`, SerializedForm).then(res => {
            if (res && res.deployed) {
                form.current = Form.fromJSON(res);
                setMainPage(false);
            }
            setLoadingForm(false);
        });

        setTimeout(() => {
            if (mainPage) {
                setLoadingForm(false);
            }
        }, 3000);
    }, [formId]);

    if (mainPage && !loadingForm) return <MainPage setFormId={setFormId} />;
    if (form.current) return <FormPage form={form} />;
    return <h1 style={{ textAlign: "center" }}>Loading Form <Spinner></Spinner></h1>;
}

export default Forms;
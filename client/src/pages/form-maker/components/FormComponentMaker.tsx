import formComponents, { FormComponent as FormComponentClass, Information, MultipleChoice, Number, SectionBreak, ShortResponse } from "@shared/forms/FormComponents";
import { useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";

type MakerProps<T extends FormComponentClass> = {
    component: T,
    setCanSubmit: (v: boolean) => void,
    forceUpdate: () => void;
};

function FormComponentMaker({ component, setCanSubmit, forceUpdate }: MakerProps<FormComponentClass>) {
    if (component instanceof formComponents.SectionBreak) {
        return <SectionBreakMaker component={component} setCanSubmit={setCanSubmit} forceUpdate={forceUpdate} />;
    }

    if (component instanceof formComponents.Information) {
        return <InformationMaker component={component} setCanSubmit={setCanSubmit} forceUpdate={forceUpdate} />;
    }

    if (component instanceof formComponents.MultipleChoice) {
        return <MultipleChoiceMaker component={component} setCanSubmit={setCanSubmit} forceUpdate={forceUpdate} />;
    }

    if (component instanceof formComponents.Number) {
        return <NumberMaker component={component} setCanSubmit={setCanSubmit} forceUpdate={forceUpdate} />
    }

    if (component instanceof formComponents.ShortResponse) {
        return <ShortResponseMaker component={component} setCanSubmit={setCanSubmit} forceUpdate={forceUpdate} />
    }

    return <div>Unknown component type</div>;
}

export default FormComponentMaker;

function SectionBreakMaker({ component, setCanSubmit, forceUpdate }: MakerProps<SectionBreak>) {
    const [title, setTitle] = useState("");

    useEffect(() => { component.title = title; }, [title]);

    useEffect(() => {
        forceUpdate();
        setCanSubmit(title !== "");
    }, [title]);

    return (
        <div>
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Section Break Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
    );
}

function InformationMaker({ component, setCanSubmit, forceUpdate }: MakerProps<Information>) {
    const [text, setText] = useState("");

    useEffect(() => { component.text = text; }, [text]);

    useEffect(() => {
        forceUpdate();
        setCanSubmit(text !== "");
    }, [text]);

    return (
        <div>
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Information Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
}

function MultipleChoiceMaker({ component, setCanSubmit, forceUpdate }: MakerProps<MultipleChoice>) {
    const [choices, setChoices] = useState("");
    const [name, setName] = useState("");
    const [question, setQuestion] = useState("");

    useEffect(() => { component.choices = choices.split(","); }, [choices]);
    useEffect(() => { component.question = question; }, [question]);
    useEffect(() => { component.name = name; }, [name]);

    useEffect(() => {
        forceUpdate();
        setCanSubmit(question !== "" && name !== "" && choices !== "" && choices.split(",").length > 0);
    }, [question, name, choices]);

    return (
        <div>
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Datapoint Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Choices (Comma Seperated)"
                value={choices}
                onChange={(e) => setChoices(e.target.value)}
            />
        </div>
    );
}

function NumberMaker({ component, setCanSubmit, forceUpdate }: MakerProps<Number>) {
    const [name, setName] = useState("");
    const [question, setQuestion] = useState("");
    const [validation, setValidation] = useState("");

    useEffect(() => { component.question = question; }, [question]);
    useEffect(() => { component.name = name; }, [name]);
    useEffect(() => {
        if (validation === "") component.validation = undefined;
        component.validation = { type: "tba", path: validation };
    }, [validation]);

    useEffect(() => {
        forceUpdate();
        setCanSubmit(question !== "" && name !== "");
    }, [question, name]);

    return (
        <div>
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Datapoint Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="[TBA Validation Path]"
                value={validation}
                onChange={(e) => setValidation(e.target.value)}
            />
        </div>
    );
}

function ShortResponseMaker({ component, setCanSubmit, forceUpdate }: MakerProps<ShortResponse>) {
    const [name, setName] = useState("");
    const [question, setQuestion] = useState("");

    useEffect(() => { component.question = question; }, [question]);
    useEffect(() => { component.name = name; }, [name]);

    useEffect(() => {
        forceUpdate();
        setCanSubmit(question !== "" && name !== "");
    }, [question, name]);

    return (
        <div>
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <FormControl
                className="mx-auto text-center my-2"
                style={{ maxWidth: "300px" }}
                placeholder="Datapoint Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
    );
}
import formComponents, { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import { Card, Form as BSForm, Button } from "react-bootstrap";
import FormComponentMaker from "./FormComponentMaker";
import { useReducer, useState } from "react";
import FormComponent from "../../../partials/components/FormComponent";
import Comparative from "../../../partials/components/Comparative";
import { FormType } from "@shared/forms/Form";
import { SubmittedResponseType } from "@shared/schemas/data";

export default function NewComponent({ addComponent }: { addComponent: (component: FormComponentClass) => boolean; }) {
    const [component, _setComponent] = useState("SectionBreak");
    const [componentClass, setComponentClass] = useState<FormComponentClass>(new formComponents.SectionBreak(""));

    const [addFailed, setAddFailed] = useState<boolean>(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [componentMakerKey, setComponentMakerKey] = useState(0);

    const resetMaker = () => setComponentMakerKey(componentMakerKey + 1);

    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    const setComponent = (c: string) => {
        if (c in formComponents) {
            const component = c as keyof typeof formComponents;
            _setComponent(c);
            switch (component) {
                case "MultipleChoice":
                    return setComponentClass(new formComponents[component]("", "", []));
                case "Range":
                    return setComponentClass(new formComponents[component]("", "", 0, 0, 0));
                default:
                    return setComponentClass(new formComponents[component]("", ""));
            }
        };
    };

    const submitComponent = () => {
        const add = addComponent(componentClass);
        setAddFailed(!add);
        setTimeout(() => setAddFailed(false), 1000);
        if (!add) return;

        setComponent(component);
        resetMaker();
    };

    return (
        <Card className="m-3 bg-primary-subtle">
            <Card.Body className="w-100">
                <Card.Title>New Component</Card.Title>

                <BSForm.Select
                    className="w-100 mx-auto text-center"
                    style={{ maxWidth: "300px" }}
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                >
                    {Object.keys(formComponents).map(c =>
                        <option key={c} value={c}>{c.replace(/([A-Z])/g, ' $1').trim()}</option>
                    )}
                </BSForm.Select>

                <div>
                    <FormComponentMaker
                        key={componentMakerKey}
                        setCanSubmit={setCanSubmit}
                        component={componentClass}
                        forceUpdate={forceUpdate}
                    />
                </div>

                <Button
                    variant={addFailed ? "danger" : "primary"}
                    className="w-100 mb-4"
                    style={{ maxWidth: "300px" }}
                    onClick={submitComponent}
                    disabled={!canSubmit || addFailed}
                >
                    {addFailed ? "Duplicate datapoint name" : "Add to form"}
                </Button>

                <h5>Preview:</h5>

                <Card className="mt-2" style={{ backgroundColor: "rgb(197, 197, 197)" }}>
                    <Card.Body>
                        {componentClass instanceof formComponents.Comparative
                            ? <Comparative component={componentClass} onChange={() => undefined} answers={new Map()} teams={componentClass.metadata?.formType === FormType.ALLIANCE ? [2974, 1648, 254] : [2974, 1648, 254, 1771, 2025, 1678]} />
                            : <FormComponent component={componentClass} onAnswerChange={() => undefined} answer={undefined} responseType={SubmittedResponseType.SINGLE_TEAM_FORMS} />
                        }
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
}
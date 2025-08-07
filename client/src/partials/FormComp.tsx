import Form, { FormType } from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import { Form as BSForm } from "react-bootstrap";
import DisabledInput from "./components/DisabledInput";
import FormComponent from "./components/FormComponent";
import SectionBreak from "./components/SectionBreak";

export default function FormComp({ form, handleAnswerChange, answers, match, team, teams, dragging }: { form: Form, handleAnswerChange: (id: string, val: string) => void, answers: Map<string, string>, match?: number, team?: number, teams?: number[], dragging?: string; }) {
    if (form.type === FormType.TEAM) return (
        <BSForm>
            <SectionBreak component={new formComponents.SectionBreak("Pre-game")} />
            <DisabledInput val={match}>Match Number</DisabledInput>
            <DisabledInput val={team}>Team Number</DisabledInput>
            {form.getComponents().map(c => (
                <div className={dragging === c.getId() ? "bg-primary-subtle p-2" : ""}>
                    <FormComponent
                        key={c.getId()}
                        component={c}
                        onAnswerChange={handleAnswerChange}
                        answer={answers.get(c.getId())}
                    />
                </div>
            ))}
        </BSForm>
    );

    if (form.type === FormType.ALLIANCE) return (
        <BSForm>
            <hr />
            <DisabledInput val={match}>Match Number</DisabledInput>
            {teams?.map(t => (
                <div>
                    <hr />
                    <h2>Team #{t}</h2>
                    {form.getComponents().map(c => (
                        <div className={dragging === c.getId() ? "bg-primary-subtle p-4" : ""}>
                            <FormComponent
                                key={t + "##" + c.getId()}
                                team={t}
                                component={c}
                                onAnswerChange={handleAnswerChange}
                                answer={answers.get(t + "##" + c.getId())}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </BSForm>
    );
};
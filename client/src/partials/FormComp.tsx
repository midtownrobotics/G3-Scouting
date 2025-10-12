import Form, { FormType } from "@shared/forms/Form";
import { Form as BSForm } from "react-bootstrap";
import FormComponent from "./components/FormComponent";
import SpecialInput from "./components/SpecialInput";
import { Alliance } from "@shared/forms/FormUtils";

function isAlliance(val: string): val is keyof typeof Alliance {
    return val in Alliance;
}

export default function FormComp({
    form,
    handleAnswerChange,
    answers,
    match,
    team,
    teams,
    alliance,
    dragging,
    setTeam,
    setAlliance
}: {
    form: Form,
    handleAnswerChange: (id: string, val: string) => void,
    answers: Map<string, string>,
    match?: number,
    team?: number,
    teams?: number[],
    alliance?: Alliance,
    dragging?: string,
    setAlliance?: (a: Alliance) => void,
    setTeam?: (t: number) => void;
}) {
    const _setAlliance = (val: string) => {
        if (setAlliance === undefined) return;
        if (isAlliance(val)) setAlliance(Alliance[val]);
    };

    if (form.type === FormType.TEAM) return (
        <BSForm>
            <hr />
            <SpecialInput value={match}>Match Number</SpecialInput>
            <SpecialInput value={team} setter={setTeam}>Team Number</SpecialInput>
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
            <SpecialInput value={match}>Match Number</SpecialInput>
            <BSForm.Select 
                value={alliance} 
                onChange={e => _setAlliance(e.target.value)}
                className="w-100 mx-auto text-center"
                style={{ maxWidth: "150px" }}
            >
                <option value={Alliance.BLUE}>Blue</option>
                <option value={Alliance.RED}>Red</option>
            </BSForm.Select>
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

    if (form.type === FormType.NO_MATCH || form.type === FormType.SINGLE_TEAM_RESPONSE) return (
        <BSForm>
            <hr />
            <SpecialInput value={team} setter={setTeam}>Team Number</SpecialInput>
            {form.getComponents().map(c => (
                <div key={c.getId()} className={dragging === c.getId() ? "bg-primary-subtle p-2" : ""}>
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
};
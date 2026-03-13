import Form, { FormType } from "@shared/forms/Form";
import { Form as BSForm } from "react-bootstrap";
import FormComponent from "./components/FormComponent";
import SpecialInput from "./components/SpecialInput";
import { Alliance } from "@shared/utils";
import formComponents, { Comparative } from "@shared/forms/FormComponents";
import ComparativeElement from "./components/Comparative";
import TeamSelector from "./components/TeamSelector";
import { SubmittedResponseType } from "@shared/schemas/data";

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
    highlighting,
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
    highlighting?: string,
    setAlliance?: (a: Alliance) => void,
    setTeam?: (t: number) => void;
}) {
    const _setAlliance = (val: string) => {
        if (setAlliance === undefined) return;
        if (isAlliance(val)) setAlliance(Alliance[val]);
    };

    const comparativeComponents = form.getComponents().filter(c => c instanceof Comparative);

    if (form.type === FormType.TEAM) return (
        <BSForm>
            <hr />
            <SpecialInput value={match}>Match Number</SpecialInput>
            <SpecialInput value={team} setter={setTeam}>Team Number</SpecialInput>
            {form.getComponents().map(c => (
                <div key={c.getId()} className={highlighting === c.getId() ? "bg-primary-subtle p-2" : ""}>
                    <FormComponent
                        component={c}
                        onAnswerChange={handleAnswerChange}
                        answer={answers.get(c.getId())}
                        responseType={SubmittedResponseType.SINGLE_TEAM_FORMS}
                        highlighting={highlighting === c.getId()}
                    />
                </div>
            ))}
        </BSForm>
    );

    if (form.type === FormType.ALLIANCE || form.type === FormType.WHOLE_MATCH) return (
        <BSForm>
            <hr />
            <SpecialInput value={match}>Match Number</SpecialInput>

            {form.type === FormType.ALLIANCE &&
                <BSForm.Select
                    value={alliance}
                    onChange={e => _setAlliance(e.target.value)}
                    className="w-100 mx-auto text-center"
                    style={{ maxWidth: "150px" }}
                >
                    <option value={Alliance.BLUE}>Blue</option>
                    <option value={Alliance.RED}>Red</option>
                </BSForm.Select>
            }

            {form.getComponents().length !== comparativeComponents.length && teams?.map(t => (
                <div>
                    <hr />
                    <h2>Team #{t}</h2>
                    {form.getComponents().map(c => (
                        <div className={highlighting === c.getId() ? "bg-primary-subtle p-4" : ""}>
                            <FormComponent
                                key={t + "##" + c.getId()}
                                team={t}
                                component={c}
                                onAnswerChange={handleAnswerChange}
                                answer={answers.get(t + "##" + c.getId())}
                                responseType={SubmittedResponseType.MULTI_TEAM_FORMS}
                                highlighting={highlighting === c.getId()}
                            />
                        </div>
                    ))}
                </div>
            ))}

            {teams && comparativeComponents.map(c =>
                <div className={highlighting === c.getId() ? "bg-primary-subtle p-4" : ""}>
                    <hr />
                    <ComparativeElement
                        key={c.getId()}
                        component={c}
                        onChange={handleAnswerChange}
                        answers={answers}
                        teams={teams}
                    />
                </div>
            )}
        </BSForm>
    );

    if (form.type === FormType.COMPARATIVE) return (
        <BSForm>
            <hr />
            <SpecialInput value={match}>Match Number</SpecialInput>

            {teams && setTeam
                ? <TeamSelector teams={teams} onChange={setTeam} />
                : <span>Loading...</span>
            }

            <div>
                <hr />
                <h2>Team #{team}</h2>
                {teams && form.getComponents().map(c => (
                    <div className={highlighting === c.getId() ? "bg-primary-subtle p-4" : ""}>
                        {c instanceof formComponents.Comparative
                            ? <ComparativeElement
                                key={c.getId()}
                                component={c}
                                onChange={handleAnswerChange}
                                answers={answers}
                                teams={teams}
                            />
                            : <FormComponent
                                key={team + "##" + c.getId()}
                                team={team}
                                component={c}
                                onAnswerChange={handleAnswerChange}
                                answer={answers.get(team + "##" + c.getId())}
                                responseType={SubmittedResponseType.MULTI_TEAM_FORMS}
                                highlighting={highlighting === c.getId()}
                            />
                        }
                    </div>
                ))}
            </div>
        </BSForm>
    );

    if (form.type === FormType.NO_MATCH || form.type === FormType.SINGLE_TEAM_RESPONSE) return (
        <BSForm>
            <hr />
            <SpecialInput value={team} setter={setTeam}>Team Number</SpecialInput>
            {form.getComponents().map(c => (
                <div key={c.getId()} className={highlighting === c.getId() ? "bg-primary-subtle p-2" : ""}>
                    <FormComponent
                        key={c.getId()}
                        component={c}
                        onAnswerChange={handleAnswerChange}
                        answer={answers.get(c.getId())}
                        responseType={SubmittedResponseType.SINGLE_TEAM_FORMS}
                        highlighting={highlighting === c.getId()}
                    />
                </div>
            ))}
        </BSForm>
    );
};
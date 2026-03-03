import Form, { FormType } from "@shared/forms/Form";
import formComponents from "@shared/forms/FormComponents";
import { SerializedForm } from "@shared/schemas/forms";
import { DataType, Equation, EquationComponentType } from "@shared/schemas/virtualDataRecorder";
import FormResponseByTeamModel from "server/models/forms/FormResponseModels";

export function equationNeedsCalculateOtf(equation: Equation) {
    for (const component of equation) {
        if (component.componentType === EquationComponentType.DATA && component.data.type === DataType.SOM_TEAM_AVG) return true;
    }
    return false;
}

export function serializeEquation(equation: Equation) {
    return JSON.stringify(equation);
}

export function getEquationEvaluationId(equation: Equation, match?: number, team?: number) {
    if (!match) return `nm--${team}--${serializeEquation(equation)}`;
    if (!team) return `${match}--nt--${serializeEquation(equation)}`;
    return `${match}--${team}--${serializeEquation(equation)}`;
}

export function getEquationEvaluationExpiry(equation: Equation) {
    if (
        equation.some(c =>
            c.componentType === EquationComponentType.DATA && (
                c.data.type === DataType.SOM_TEAM_AVG ||
                c.data.type === DataType.STATBOTICS_TEAM ||
                c.data.type === DataType.TBA_TEAM
            )
        )
    ) return Date.now() + 120000;
    return Infinity;
}

function getResponses() {
    return FormResponseByTeamModel.getVirtualData()
}

export async function getVdrFormSerialized(includeResponses?: boolean) {
    const data = includeResponses ? (await getResponses()) : undefined;
    const vdrForm: SerializedForm = {
        type: FormType.TEAM,
        id: 'VDR',
        name: 'VDR',
        description: '',
        deployed: true,
        openSubmission: false,
        maxComponentId: 0,
        components: data?.questions.map(q => ({
            type: "Number",
            id: q.id,
            creationArgs: [q.name, q.name]
        })) ?? [],
        responses: data?.responses
    };
    return vdrForm;
}

export async function getVdrForm(includeResponses?: boolean) {
    return Form.fromJSON(await getVdrFormSerialized(includeResponses), true);
}
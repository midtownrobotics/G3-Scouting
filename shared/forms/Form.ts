import { FormQuestionMeta, RowData } from "@shared/schemas/data";
import FormResponseModel from "../../server/models/forms/FormResponseModel";
import { SerializedForm, SerializedResponse } from "../schemas/forms";
import { FormComponent } from "./FormComponents";
import { removeDuplicatesByKey, toSqlAcceptableString } from "./FormUtils";

export default class Form {
    public readonly name: string;
    public readonly id: string;
    public deployed: boolean = true;

    public maxComponentId: number;

    private components: FormComponent[] = [];

    constructor(name: string, description: string);
    constructor(name: string, description: string, components: FormComponent[], maxComponentId: number, responses?: SerializedResponse[]);
    constructor(name: string, public description: string, components?: FormComponent[], maxComponentId?: number, private responses?: SerializedResponse[]) {
        this.name = name;
        this.id = toSqlAcceptableString(name);

        this.maxComponentId = maxComponentId ?? 0;

        if (components) this.components = removeDuplicatesByKey(components, "id");
    }

    getComponents = (): FormComponent[] => [...this.components];
    getComponent = (id: string): FormComponent | undefined => this.components.find(c => c.id === id);

    /**
     * Adds a component to this form.
     * @param component The component to add.
     * @returns `true` if successful. `false` if another component already has this name.
     */
    public addComponent(component: FormComponent): boolean {
        if (this.components.some(c => c.columnData?.name && c.columnData?.name == component.columnData?.name)) return false;
        component.setId(`${component.columnData?.name}-${this.maxComponentId++}`);
        this.components.push(component);
        return true;
    }

    public removeComponent(id: string): void {
        this.components = this.components.filter(c => c.getId() !== id);
    }

    public moveComponent(id: string, toIndex: number): void {
        const fromIndex = this.components.findIndex(c => c.getId() == id);
        if (fromIndex === -1 || toIndex < 0 || toIndex >= this.components.length) return;
        const [item] = this.components.splice(fromIndex, 1);
        this.components.splice(toIndex, 0, item);
    }


    public updateResponseData(models: FormResponseModel[]) {
        this.responses = models.map(rm => rm.response);
    }

    /** Gets response data for this form, if form has associated data. Each response will have a `!UserId` and `!SubmittedAt` questions, aswell as questions for all question asking form components. */
    public getResponseData() {
        const questions = new Map<string, FormQuestionMeta>();
        questions.set("UserId", { name: "UserId", type: "number", classification: "qualitative" });
        questions.set("SubmittedAt", { name: "SubmittedAt", type: "string", classification: "qualitative" });
        this.components.forEach(c => c.columnData && questions.set(c.id, c.columnData));

        const rows: RowData[] = [];
        
        this.responses?.forEach(r => {
            const fieldResponses: {question: string, response: string}[] = []
            let teamNumber: number | undefined;
            let matchNumber: number | undefined;
            r.forEach(q => {
                const questionData = questions.get(q[0])
                if (!questionData) return;
                if (questionData.classification == "matchNumber") matchNumber = parseInt(q[1]);
                if (questionData.classification == "teamNumber") teamNumber = parseInt(q[1]);
                fieldResponses.push({ question: q[0], response: q[1] });
            });
            if (teamNumber === undefined || matchNumber === undefined) return;
            rows.push({ fieldResponses, teamNumber, matchNumber });
        });

        const ids = Array.from(questions.keys())

        return {
            questions: Array.from(questions.values()).map((v, i) => ({id: ids[i], ...v})),
            responses: rows
        };
    }

    public static fromJSON(json: SerializedForm): Form {
        return new Form(json.name, json.description, json.components.map(c => FormComponent.fromJSON(c)), json.maxComponentId, json.responses);
    }

    public toJSON(): SerializedForm {
        return {
            name: this.name,
            components: this.getComponents().map(c => c.toJSON()),
            id: this.id,
            maxComponentId: this.maxComponentId,
            deployed: this.deployed,
            description: this.description,
            responses: this.responses
        };
    }
}
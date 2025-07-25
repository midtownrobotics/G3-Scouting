import FormResponseByTeamModel from "../../server/models/forms/FormResponseModel";
import { FormResponse, FormResponseData } from "../schemas/data";
import { SerializedForm } from "../schemas/forms";
import { FormComponent } from "./FormComponents";
import { generateRandomString, toSqlAcceptableString } from "./FormUtils";

export default class Form {
    public readonly name: string;
    public readonly id: string;
    public deployed: boolean = true;
    public maxComponentId: number;

    private components: FormComponent[] = [];

    public get needsValidation(): boolean {
        return this.components.some(c => c.needsValidation);
    }

    constructor(name: string, description: string);
    constructor(name: string, description: string, components: FormComponent[], maxComponentId: number, responses?: FormResponse[]);
    constructor(name: string, public description: string, components?: FormComponent[], maxComponentId?: number, private responses?: FormResponse[]) {
        this.name = name;
        this.id = toSqlAcceptableString(name);
        this.maxComponentId = maxComponentId ?? 0;

        const uniqueMap = new Map<string, FormComponent>();
        for (const component of components ?? []) {
            const id = component.getId();
            if (!uniqueMap.has(id)) {
                uniqueMap.set(id, component);
            }
        }
        this.components = Array.from(uniqueMap.values());
    }

    getComponents = (): FormComponent[] => [...this.components];
    getComponent = (id: string): FormComponent | undefined => this.components.find(c => c.getId() === id);

    /**
     * Adds a component to this form.
     * @param component The component to add.
     * @returns `true` if successful. `false` if another component already has this name.
     */
    public addComponent(component: FormComponent): boolean {
        if (this.components.some(c => c.name && c.name == component.name)) return false;
        component.setMetadata(`${component.name || generateRandomString(6)}-${this.maxComponentId++}`, this.id);
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

    public updateResponseData(models: FormResponseByTeamModel[]) {
        this.responses = models;
    }

    /** Gets response data for this form, if form has associated data. 
     * @returns `null` if there are no reponses. Try passing `true` into FormModel.getForm(). */
    public getResponseData(): FormResponseData | null {
        if (!this.responses) return null;
        const questions = this.components.filter(c => c.metadata !== null).map(q => q.metadata!);

        return {
            formId: this.id,
            questions,
            responses: this.responses
        };
    }

    public static fromJSON(json: SerializedForm): Form {
        return new Form(json.name, json.description, json.components.map(c => FormComponent.fromJSON(c, json.id)), json.maxComponentId, json.responses);
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
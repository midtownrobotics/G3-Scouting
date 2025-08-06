import { FormResponse, FormResponseData } from "../schemas/data";
import { SerializedForm } from "../schemas/forms";
import { FormComponent } from "./FormComponents";
import { generateRandomString, toAlphanumeric } from "./FormUtils";
import FormResponseByTeamModel from "../../server/models/forms/FormResponseModels";

export enum FormType {
    TEAM = "TEAM",
    ALLIANCE = "ALLIANCE"
}

export default class Form {
    public readonly name: string;
    public readonly id: string;
    public maxComponentId: number;

    protected components: FormComponent[] = [];
    protected responses?: FormResponse[];

    public get needsValidation(): boolean {
        return this.components.some(c => c.needsValidation);
    }

    constructor(public deployed: boolean, public type: FormType, name: string, public description: string, components?: FormComponent[], maxComponentId?: number, responses?: FormResponse[]) {
        this.responses = responses;
        this.name = name;
        this.id = toAlphanumeric(name);
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

    public moveComponent(id: string, toIndex: number) {
        const fromIndex = this.components.findIndex(c => c.getId() == id);
        if (fromIndex === -1 || toIndex < 0 || toIndex >= this.components.length) return this.components;
        const [item] = this.components.splice(fromIndex, 1);
        this.components.splice(toIndex, 0, item);
        return this.components;
    }

    public static fromJSON(json: SerializedForm): Form {
        return new Form(
            json.deployed, 
            json.type, 
            json.name, 
            json.description, 
            json.components.map(c => FormComponent.fromJSON(c, json.id)), 
            json.maxComponentId, 
            json.responses
        );
    }

    /** Gets response data for this form, if form has associated data. 
     * @param minAccuracy The minimum accuracy for responses to be included in the data result.
     * @returns `null` if there are no reponses. Be sure to pass `true` into FormModel.getForm(s).
     */
    public updateResponseData(models: FormResponseByTeamModel[]): void {
        this.responses = models.map(m => m.toJSON());
    }

    public getResponseData(minAccuracy?: number): FormResponseData | null {
        if (!this.responses) return null;
        const questions = this.components.filter(c => c.metadata !== null).map(q => q.metadata!);

        return {
            formId: this.id,
            questions,
            responses: (
                minAccuracy === undefined
                    ? this.responses
                    : this.responses.filter(r => (r.accuracyScore || 0) >= minAccuracy)
            )
        };
    }

    public toJSON(): SerializedForm {
        return {
            type: FormType.ALLIANCE,
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
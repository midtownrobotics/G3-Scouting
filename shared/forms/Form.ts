import z from "zod";
import { FormResponse, FormResponseData } from "../schemas/data";
import { SerializedForm } from "../schemas/forms";
import { FormComponent } from "./FormComponents";
import { generateRandomString, toAlphanumeric } from "./FormUtils";

export enum FormType {
    TEAM = "TEAM",
    ALLIANCE = "ALLIANCE",
    NO_MATCH = "NO_MATCH",
    SINGLE_TEAM_RESPONSE = "SINGLE_TEAM_RESPONSE",
    WHOLE_MATCH = "WHOLE_MATCH",
    COMPARATIVE = "COMPARATIVE"
}

export const ZodFormType = z.nativeEnum(FormType);

export default class Form {
    public readonly name: string;
    public readonly id: string;
    public maxComponentId: number = 0;
    public deployed = false;
    public openSubmission = false;

    protected components: FormComponent[] = [];
    protected responses?: FormResponse[];

    public get needsValidation(): boolean {
        return this.components.some(c => c.needsValidation);
    }

    constructor(public type: FormType, name: string, public description: string) {
        if (name === "VDR") throw new Error("Form name cannot be \"VDR\"");
        this.name = name;
        this.id = toAlphanumeric(name);
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
        component.setMetadata(`${component.name || generateRandomString(6)}-${this.maxComponentId++}`, this.id, this.type);
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
        const form = new Form(
            json.type,
            json.name,
            json.description
        );

        form.responses = json.responses;
        form.deployed = json.deployed;
        form.openSubmission = json.openSubmission;
        form.maxComponentId = json.maxComponentId ?? 0;
        form.setComponents(json.components.map(c => FormComponent.fromJSON(c, json.id, json.type)));

        return form;
    }

    /**
     * **Removes all currently added components** and new ones.
     * @param components The array of components to add.
     */
    public setComponents(components: FormComponent[]) {
        const uniqueMap = new Map<string, FormComponent>();
        for (const component of components ?? []) {
            const id = component.getId();
            if (!uniqueMap.has(id)) {
                uniqueMap.set(id, component);
            }
        }
        this.components = Array.from(uniqueMap.values());
    }

    /** Gets response data for this form, if form has associated data. 
     * @param maxError The maximum error for responses to be included in the data result.
     * @returns `null` if there are no responses. Be sure to pass `true` into FormModel.getForm(s).
     */
    public getResponseData(maxError?: number, fromMatch?: number, toMatch?: number): FormResponseData | null {
        if (!this.responses) return null;
        if (this.type === FormType.NO_MATCH || this.type === FormType.SINGLE_TEAM_RESPONSE) maxError = undefined;

        const questions = this.components.filter(c => c.metadata !== null).map(q => q.metadata!);

        return {
            formId: this.id,
            formType: this.type,
            questions,
            responses: (
                maxError === undefined
                    ? this.responses
                    : this.responses.filter(r =>
                        (
                            (r.accuracyScore || 0) <= maxError
                        ) && (
                            (r.match && fromMatch !== undefined) ? r.match >= fromMatch : true
                        ) && (
                            (r.match && toMatch !== undefined) ? r.match <= toMatch : true
                        )
                    )
            )
        };
    }

    public toJSON(): SerializedForm {
        return {
            type: this.type,
            name: this.name,
            components: this.getComponents().map(c => c.toJSON()),
            id: this.id,
            openSubmission: this.openSubmission,
            maxComponentId: this.maxComponentId,
            deployed: this.deployed,
            description: this.description,
            responses: this.responses
        };
    }
}
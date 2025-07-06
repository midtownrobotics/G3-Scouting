import { SerializedForm } from "../schemas/forms";
import { FormComponent } from "./FormComponents";
import { removeDuplicatesByKey, toSqlAcceptableString } from "./FormUtils";

export default class Form {
    public readonly name: string;
    public readonly id: string;
    public deployed: boolean = true;

    public maxComponentId: number;

    private components: FormComponent[] = [];

    constructor(name: string)
    constructor(name: string, components: FormComponent[], maxComponentId: number)
    constructor(name: string, components?: FormComponent[], maxComponentId?: number) {
        this.name = name;
        this.id = toSqlAcceptableString(name);

        this.maxComponentId = maxComponentId ?? 0

        if (components) this.components = removeDuplicatesByKey(components, "id");
    }

    getComponents = (): FormComponent[] => [...this.components];
    getComponent = (id: number): FormComponent | undefined => this.components.find(c => c.id === id);

    /**
     * Adds a component to this form.
     * @param component The component to add.
     * @returns `true` if successful. `false` if another component already has this name.
     */
    public addComponent(component: FormComponent): boolean {
        if (this.components.some(c => c.columnData?.name && c.columnData?.name == component.columnData?.name)) return false;
        component.setId(this.maxComponentId++);
        this.components.push(component);
        return true;
    }

    public removeComponent(id: number): void {
        this.components = this.components.filter(c => c.getId() !== id)
    }

    public moveComponent(id: number, toIndex: number): void {
        const item = this.components.splice(this.components.findIndex(c => c.getId() == id), 1)[0];
        this.components.splice(toIndex, 0, item);
    }

    public static fromJSON(json: SerializedForm): Form {
        return new Form(json.name, json.components.map(c => FormComponent.fromJSON(c)), json.maxComponentId)
    }

    public toJSON(): SerializedForm {
        return {
            name: this.name,
            components: this.getComponents().map(c => c.toJSON()),
            id: this.id,
            maxComponentId: this.maxComponentId,
            deployed: this.deployed
        }
    }
}
import { QuestionMetadata, QuestionValidationData } from "../schemas/data";
import { SerializedComponent } from "../schemas/forms";

export abstract class FormComponent {
    protected id: string = "none";
    public getId = () => this.id;
    public setMetadata(id: string, formId: string) {
        this.id = id;
        this._setMetadata(id, formId);
    }
    public get needsValidation() {
        return (
            this.metadata !== null
            && "validation" in this.metadata
            && this.metadata.validation !== undefined
        )
    }

    protected abstract _setMetadata(id: string, formId: string): void;
    public abstract name: string | null;
    public abstract metadata: QuestionMetadata | null;
    public abstract toJSON(): SerializedComponent;

    public static fromJSON(json: SerializedComponent, formId: string): FormComponent {
        const instance = new formComponents[json.type](...(json.creationArgs as [any, any, any]));
        instance.setMetadata(json.id, formId);
        return instance;
    }
}

export class SectionBreak extends FormComponent {
    public metadata = null;
    public _setMetadata() { };
    public name = null;

    /**
     * Constructs an section break component.
     * @param title The section title.
     */
    constructor(public title: string) {
        super();
    }

    public toJSON(): SerializedComponent {
        return {
            type: "SectionBreak",
            creationArgs: [this.title],
            id: this.id
        };
    }
}

export class Information extends FormComponent {
    public metadata = null;
    public _setMetadata() { };
    public name = null;

    /**
     * Constructs an info component (block of text like a description or explination).
     * @param text The text.
     */
    constructor(public text: string) {
        super();
    }

    public toJSON(): SerializedComponent {
        return {
            type: "Information",
            creationArgs: [this.text],
            id: this.id
        };
    }
}

export class MultipleChoice extends FormComponent {
    public metadata: QuestionMetadata | null = null;

    /**
     * Constructs a multiple choice question.
     * @param question The question itself. Ex: `"What is your favorite color?"`
     * @param name The form unique name of the question. Ex: `"Color"`
     * @param choices The choices. Ex: `["red", "blue", "green"]`
     */
    constructor(public question: string, public name: string, public choices: string[]) {
        super();
    }

    public _setMetadata(id: string, formId: string): void {
        this.metadata = {
            type: "string",
            classification: "quantitative",
            id,
            formId,
            namespaceId: `${formId}-${id}`,
            name: this.name
        };
    }

    public toJSON(): SerializedComponent {
        if (!this.metadata) throw new Error("Cannot serialize component without adding it to a form.");
        return {
            type: "MultipleChoice",
            creationArgs: [this.question, this.metadata.name, this.choices],
            id: this.id
        };
    }
}

export class ShortResponse extends FormComponent {
    public metadata: QuestionMetadata | null = null;

    /**
     * Constructs a short response question.
     * @param question The question itself. Ex: `"What is your favorite color?"`
     * @param name The form unique name of the question. Ex: `"Color"`
     */
    constructor(public question: string, public name: string) {
        super();
    }

    public _setMetadata(id: string, formId: string): void {
        this.metadata = {
            name: this.name,
            type: "string",
            classification: "qualitative",
            id,
            formId,
            namespaceId: `${formId}-${id}`,
        };
    }

    public toJSON(): SerializedComponent {
        if (!this.metadata) throw new Error("Cannot serialize component without adding it to a form.");
        return {
            type: "ShortResponse",
            creationArgs: [this.question, this.metadata.name],
            id: this.id
        };
    }
}

export class Number extends FormComponent {
    public metadata: QuestionMetadata | null = null;

    /**
     * Constructs a number based question.
     * @param question The question itself. Ex: `"How old are you?"`
     * @param name The form unique name of the question. Ex: `"Age"`
     */
    constructor(public question: string, public name: string, public validation?: QuestionValidationData) {
        super();
    }

    public _setMetadata(id: string, formId: string): void {
        this.metadata = {
            type: "number",
            classification: "quantitative",
            name: this.name,
            id,
            formId,
            namespaceId: `${formId}-${id}`,
            validation: this.validation
        };
    }

    public toJSON(): SerializedComponent {
        if (!this.metadata) throw new Error("Cannot serialize component without adding it to a form.");
        return {
            type: "Number",
            creationArgs: [this.question, this.metadata.name, this.validation],
            id: this.id
        };
    }
}

const formComponents = {
    SectionBreak,
    Number,
    ShortResponse,
    MultipleChoice,
    Information
} as const;

export default formComponents;
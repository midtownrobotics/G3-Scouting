import { FormQuestionMeta } from "@shared/schemas/data";
import { SerializedComponent } from "../schemas/forms";

export abstract class FormComponent {
    public id: string = "unknown";
    getId = () => this.id;
    setId = (id: string) => this.id = id;

    public abstract columnData: FormQuestionMeta | null;

    public abstract toJSON(): SerializedComponent;

    public static fromJSON(json: SerializedComponent): FormComponent {
        const instance = new formComponents[json.type](...(json.creationArgs as [any, any, any]));
        instance.setId(json.id);
        return instance;
    }
}

export class SectionBreak extends FormComponent {
    public columnData = null;

    /**
     * Constructs an section break component.
     * @param title The section title.
     */
    constructor(public title: string) {
        super()
        this.columnData = null;
    }

    public toJSON(): SerializedComponent {
        return {
            type: "SectionBreak",
            creationArgs: [this.title],
            id: this.id
        }
    }
}

export class Information extends FormComponent {
    public columnData = null;

    /**
     * Constructs an info component (block of text like a description or explination).
     * @param text The text.
     */
    constructor(public text: string) {
        super()
        this.columnData = null;
    }

    public toJSON(): SerializedComponent {
        return {
            type: "Information",
            creationArgs: [this.text],
            id: this.id
        }
    }
}

export class MultipleChoice extends FormComponent {
    public columnData: FormQuestionMeta;

    /**
     * Constructs a multiple choice question.
     * @param question The question itself. Ex: `"What is your favorite color?"`
     * @param name The form unique name of the question. Ex: `"Color"`
     * @param choices The choices. Ex: `["red", "blue", "green"]`
     */
    constructor(public question: string, name: string, public choices: string[]) {
        super();
        this.columnData = {
            name,
            type: "string",
            classification: "quantitative"
        };
    }

    public toJSON(): SerializedComponent {
        return {
            type: "MultipleChoice",
            creationArgs: [this.question, this.columnData.name, this.choices],
            id: this.id
        }
    }
}

export class ShortResponse extends FormComponent {
    public columnData: FormQuestionMeta;
    
    /**
     * Constructs a short response question.
     * @param question The question itself. Ex: `"What is your favorite color?"`
     * @param name The form unique name of the question. Ex: `"Color"`
     */
    constructor(public question: string, name: string) {
        super();
        this.columnData = {
            name,
            type: "string",
            classification: "qualitative"
        };
    }

    public toJSON(): SerializedComponent {
        return {
            type: "ShortResponse",
            creationArgs: [this.question, this.columnData.name],
            id: this.id
        }
    }
}

export class Number extends FormComponent {
    public columnData: FormQuestionMeta;
    
    /**
     * Constructs a number based question.
     * @param question The question itself. Ex: `"How old are you?"`
     * @param name The form unique name of the question. Ex: `"Age"`
     */
    constructor(public question: string, name: string) {
        super();
        this.columnData = {
            name,
            type: "number",
            classification: "quantitative"
        };
    }

    public toJSON(): SerializedComponent {
        return {
            type: "Number",
            creationArgs: [this.question, this.columnData.name],
            id: this.id
        }
    }
}

export class TeamNumber extends FormComponent {
    public columnData: FormQuestionMeta;
    
    /**
     * Constructs a team number question.
     * @param name The form unique name of the question. Ex: `"TeamNumber"` or `"Station1"`
     */
    constructor(name: string) {
        super();
        this.columnData = {
            name,
            type: "number",
            classification: "teamNumber"
        };
    }

    public toJSON(): SerializedComponent {
        return {
            type: "TeamNumber",
            creationArgs: [this.columnData.name],
            id: this.id
        }
    }
}

export class MatchNumber extends FormComponent {
    public columnData: FormQuestionMeta;
    
    /**
     * Constructs a match number question. Only one of these can exist per form.
     */
    constructor() {
        super();
        this.columnData = {
            name: "MatchNumber",
            type: "number",
            classification: "matchNumber"
        };
    }

    public toJSON(): SerializedComponent {
        return {
            type: "MatchNumber",
            creationArgs: [],
            id: this.id
        }
    }
}

const formComponents = {
    SectionBreak,
    Number,
    ShortResponse,
    MultipleChoice,
    Information,
    TeamNumber,
    MatchNumber
} as const;

export default formComponents;
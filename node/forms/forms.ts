import { Model, ModelStatic } from "sequelize";
import Question from "./Question";
import Section from "./sections";
import { FormRegistry, generateFormModel } from "./formUtils";

export interface Form {
    readonly title: string;
    readonly id: string;
    readonly enforceSchedule: boolean;

    getQuestions(): Question[]
    getQuestionIds(): string[]
    getModel(): ModelStatic<Model> | undefined;
    register(): void;
    submitResponse(): void;
    toJSON(): any;
}

export class BasicForm implements Form {
    readonly title: string;
    readonly id: string;
    readonly enforceSchedule: boolean;

    private questions: Question[] = [];
    private sections: Section[] = [];
    private questionIds: string[] = [];
    private model?: ModelStatic<Model>;

    constructor(id: string, title: string, enforceSchedule: boolean, sections: Section[]) {
        this.title = title;
        this.sections = sections;
        this.id = id;
        this.enforceSchedule = enforceSchedule;

        sections.forEach(s => s.getQuestions().forEach(q => {
            if (this.questionIds.includes(q.getId())) throw new Error("Questions in the same form cannot have duplicate IDs.")
            this.questionIds.push(q.getId())
            this.questions.push(q)
        }))
    }

    submitResponse(): void {
        throw new Error("Method not implemented.");
    }
    
    public toJSON = () => ({
        title: this.title,
        id: this.id,
        questions: this.sections.map(q => q.toJSON())
    })

    public getQuestions = () => this.questions;
    public getQuestionIds = () => this.questionIds;
    public getModel = () => this.model;

    public register() {
        FormRegistry.register(this)
        this.model = generateFormModel(this.id, this.questions)
    }
}

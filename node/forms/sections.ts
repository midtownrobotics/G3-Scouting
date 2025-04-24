import Question from "./Question";


export default class Section {
    readonly title: string;
    
    private readonly questions: Question[];

    constructor(title: string, questions: Question[]) {
        this.title = title;
        this.questions = questions;
    }

    public getQuestions = () => this.questions;

    public toJSON = () => ({
        title: this.title,
        questions: this.questions.map((q => q.toJSON()))
    })
}
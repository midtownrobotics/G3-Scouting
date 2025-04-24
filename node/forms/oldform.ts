export class BasicForm implements Form {
    readonly title: string;
    readonly id: string;

    private readonly sections: Section[];
    private readonly questions: Question[] = [];
    private readonly questionIds: string[] = []
    private readonly model: ModelStatic<Model>;

    private static readonly forms: Form[] = [];

    constructor(id: string, title: string, public enforceSchedule: boolean, sections: Section[]) {
        if (id == "users") throw new Error(`Cannot name forms "users".`);
        if (FormRegistry.getForms().some((f) => f.id == id)) throw new Error(`Duplicate form id "${id}" detected.`);

        this.title = title;
        this.sections = sections;
        this.id = id;

        this.sections.forEach((s) => this.questions.push(...s.getQuestions()));
        this.questionIds = this.questions.map((q) => q.getId());

        this.checkQuestionValidity()

        this.model = sequelize.define<Model>(id, this.generateModel(), { timestamps: false });

        FormRegistry.registerForm(this);
    }

    public getModel = () => this.model;
    public getQuestions = () => this.questions;
    public getQuestionIds = () => this.questionIds;

    public submitResponse(user: UserModel, responsePairs: ResponseKeyValuePair[]) {
        const dataToCreate: { [key: string]: string | number } = {};
        responsePairs.filter((p) => this.questionIds.includes(p.name)).forEach((p) => dataToCreate[p.name] = p.value)

        dataToCreate.scout = user.username;
        dataToCreate.scoutId = user.id;
        dataToCreate.timestamp = new Date().toLocaleString();

        this.model.create(dataToCreate)
    }
  
    private generateModel() {
        let modelAttributes: ModelAttributes = {};

        modelAttributes.id = { type: DataType.INTEGER, primaryKey: true, autoIncrement: true };
        modelAttributes.scout = { type: DataType.TEXT, allowNull: true };
        modelAttributes.scoutId = { type: DataType.INTEGER, allowNull: true };

        if (this.type == FormType.ALLIANCE_BASED) modelAttributes.teams = { type: DataType.JSON, allowNull: true };

        this.questions.forEach((q) => {
            if (modelAttributes[q.getId()]) {
                throw new Error(`Duplicate question id "${q.getId()}" detected in form "${this.id}".`);
            }
            modelAttributes[q.getId()] = {
                type: DataType.TEXT
            }
        })

        modelAttributes.timestamp = { type: DataType.TEXT, allowNull: true };

        return modelAttributes
    }

    private checkQuestionValidity() {
        const questionTypes = new Set<QuestionType>(this.questions.map(q => q.type));

        if (questionTypes.has(QuestionType.ALLIANCE) && this.type != FormType.ALLIANCE_BASED) throw new Error(`"ALLIANCE" questions can only exist on "ALLIANCE_BASED" forms.`)
        if (questionTypes.has(QuestionType.TEAM_NUMBER) && this.type != FormType.TEAM_BASED) throw new Error(`"TEAM_NUMBER" questions can only exist on "TEAM_BASED" forms.`)

        if (!questionTypes.has(QuestionType.ALLIANCE) && this.type == FormType.ALLIANCE_BASED) throw new Error(`"ALLIANCE" questions need to exist on "ALLIANCE_BASED" forms.`)
        if (!questionTypes.has(QuestionType.TEAM_NUMBER) && this.type == FormType.TEAM_BASED) throw new Error(`"TEAM_NUMBER" questions need to exist on "TEAM_BASED" forms.`)
    }


    public generateHTML(match?: MatchSimple, teamNumber?: number): string {
        if (this.type != FormType.TEAM_BASED) teamNumber = undefined;

        let sectionsHTML: string[] = []
        this.sections.forEach((s) => sectionsHTML.push(s.generateHTML(match, teamNumber)))
        
        return (`
            <form id="form" onsubmit="return false">
                ${sectionsHTML.join("")}
                <button id="submitButton" type="button">Submit</button>
            </form>
        `)
    }
}
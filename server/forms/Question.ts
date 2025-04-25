export enum QuestionType {
    MULTIPLE_CHOICE,
    LARGE_TEXT,
    NUMERICAL,
    MATCH_NUMBER,
    TEAM_NUMBER,
    ALLIANCE,
    VIRTUAL
}

export default class Question {
    readonly type: QuestionType;
    readonly title: string;
    readonly choices?: string[];
    readonly apiCall?: string;
    
    private id: string;

    constructor(type: QuestionType.TEAM_NUMBER | QuestionType.MATCH_NUMBER | QuestionType.ALLIANCE);
    constructor(type: QuestionType.NUMERICAL | QuestionType.LARGE_TEXT, id: string, title: string);
    constructor(type: QuestionType.MULTIPLE_CHOICE, id: string, title: string, choices: string[]);
    constructor(type: QuestionType.VIRTUAL, id: string, title: string, apiCall: string);
    constructor(type: QuestionType, id?: string, title?: string, choicesOrCall?: string[] | string) {
        this.type = type;

        if (this.type != QuestionType.MATCH_NUMBER && id == "matchNumber") throw new Error(`Cannot set id of non "MATCH_NUMBER" typed questions to "matchNumber".`)
        if (this.type != QuestionType.TEAM_NUMBER && id == "teamNumber") throw new Error(`Cannot set id of non "TEAM_NUMBER" typed questions to "teamNumber".`)
        if (this.type != QuestionType.ALLIANCE && id == "alliance") throw new Error(`Cannot set id of non "ALLIANCE" typed questions to "alliance".`)

        if (this.type == QuestionType.MULTIPLE_CHOICE && typeof choicesOrCall == "object") this.choices = choicesOrCall;
        if (this.type == QuestionType.VIRTUAL && typeof choicesOrCall == "string") this.apiCall = choicesOrCall;

        if (this.type == QuestionType.TEAM_NUMBER) {
            this.title = "Team Number"
            this.id = "teamNumber"
        } else if (this.type == QuestionType.MATCH_NUMBER) {
            this.title = "Match Number"
            this.id = "matchNumber"
        } else if (this.type == QuestionType.ALLIANCE) {
            this.title = "Alliance"
            this.id = "alliance"
        } else {
            this.title = title || ""
            this.id = id || ""
        };
    }

    public getId = () => this.id;

    public toJSON = () => ({
        title: this.title,
        type: this.type.toString(),
        choices: this.choices
    })
}
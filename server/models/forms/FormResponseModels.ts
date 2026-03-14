import { FormType } from "@shared/forms/Form";
import { FormResponse, FormResponseData, QuestionResponse, SubmittedResponse, SubmittedResponseType } from "@shared/schemas/data";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { evaluateEquation } from "server/data/virtualDataRecorder/evaluateEquation";
import { equationNeedsCalculateOtf } from "server/data/virtualDataRecorder/vdrUtils";
import UserModel from "../users/UserModel";
import FormModel from "./FormModel";
import VirtualDataEquationModel from "./VirtualDataEquationModels";

@Table({ tableName: "form_responses_by_team" })
export default class FormResponseByTeamModel extends Model<InferAttributes<FormResponseByTeamModel>, InferCreationAttributes<FormResponseByTeamModel>> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: CreationOptional<number>;

    @Column({ type: DataType.INTEGER })
    userId!: number;

    @ForeignKey(() => FormModel)
    @Column({
        type: DataType.STRING,
        allowNull: true,
        onDelete: 'SET NULL',
    })
    formId!: string;

    @Column({ type: DataType.INTEGER })
    team!: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    match?: number;

    @Column({ type: DataType.JSON })
    responses!: QuestionResponse[];

    @Column({ type: DataType.STRING })
    submittedAt!: string;

    @Column({ type: DataType.FLOAT, defaultValue: null })
    accuracyScore!: number | null;

    /** Turns a {@link SubmittedResponse} of either a single or multiple teams into {@link FormResponse}s and creates the models for them. */
    public static async submitResponse(r: SubmittedResponse, user: UserModel) {
        const form = await FormModel.findByPk(r.formId);
        if (!form) return;

        if (form.deployed) {
            switch (form.type) {
                case FormType.TEAM:
                    user.update({ tokens: user.tokens + 10, xp: user.xp + 130 + Math.round((Math.random() * 2 - 1) * 15) });
                    break;
                case FormType.ALLIANCE:
                case FormType.WHOLE_MATCH:
                case FormType.COMPARATIVE:
                    user.update({ tokens: user.tokens + 15, xp: user.xp + 150 + Math.round((Math.random() * 2 - 1) * 20)  });
                    break;
            }
        }

        if (r.type === SubmittedResponseType.MULTI_TEAM_FORMS) {
            for (const response of r.responses) {
                FormResponseByTeamModel.createResponse(response, user.id);
            }
        } else {
            FormResponseByTeamModel.createResponse(r.response, user.id);
        }
    }

    /** Creates the actual models from a form response. */
    private static async createResponse(r: FormResponse, userId: number) {
        const submittedAt = new Date().toLocaleString();

        try {
            await FormResponseByTeamModel.create({ ...r, userId, submittedAt });
        } catch (err: any) { }
    }

    /** Submits data from the virtual data recorder. */
    public static async submitVirtualResponse(r: FormResponse) {
        if (r.formId !== "VDR") return;
        const submittedAt = new Date().toLocaleString();
        await FormResponseByTeamModel.create({ ...r, userId: -1, submittedAt });
    }

    /** Gets all the responses from the virtual data recorder. This may take a while depending on the number of equations that need OTF calculation. */
    public static async getVirtualData(fromMatch?: number, toMatch?: number): Promise<FormResponseData> {
        const responses: FormResponse[] = (await FormResponseByTeamModel.findAll({ where: { formId: "VDR" } }))
            .filter(r => (
                (r.match && fromMatch !== undefined) ? r.match >= fromMatch : true
            ) && (
                    (r.match && toMatch !== undefined) ? r.match <= toMatch : true
                )
            );
        const equations = await VirtualDataEquationModel.findAll()
        const questions = equations.map(m => m.toQuestion());

        // responses.push({
        //     formId: "",
        //     team: 6340,
        //     match: 1,
        //     responses: [],
        // })

        for (const { equation, id, validation } of equations) {
            console.log(equationNeedsCalculateOtf(equation));
            if (!equationNeedsCalculateOtf(equation)) continue;
            for (let i = 0; i < responses.length; i++) {
                const res = await evaluateEquation(equation, responses[i].team, responses[i].match);
                responses[i].responses.push({ question: id, response: (res?.value ?? "").toString() })
            }
        }

        return {
            formId: "VDR",
            formType: FormType.TEAM,
            questions,
            responses
        };
    }
}
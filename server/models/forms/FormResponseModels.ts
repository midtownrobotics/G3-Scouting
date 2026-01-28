import { FormResponse, QuestionResponse, SubmittedResponse, SubmittedResponseType } from "@shared/schemas/data";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import FormModel from "./FormModel";
import { FormType } from "@shared/forms/Form";
import { User } from "../types";
import UserModel from "../users/UserModel";

@Table({ tableName: "form_responses_by_team" })
export default class FormResponseByTeamModel extends Model<InferAttributes<FormResponseByTeamModel>, InferCreationAttributes<FormResponseByTeamModel>> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: CreationOptional<number>;

    @Column({ type: DataType.INTEGER })
    userId!: number;

    @ForeignKey(() => FormModel)
    @Column({ type: DataType.STRING, allowNull: true })
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

    public static async submitResponse(r: SubmittedResponse, user: UserModel) {
        const form = await FormModel.findByPk(r.formId);
        if (!form) return;

        if (form.deployed && !form.openSubmission) {
            user.update({tokens: user.tokens + 10});
        }

        if (r.type === SubmittedResponseType.MULTI_TEAM_FORMS) {
            for (const response of r.responses) {
                FormResponseByTeamModel.createResponse(response, user.id);
            }
        } else {
            FormResponseByTeamModel.createResponse(r.response, user.id);
        }
    }

    private static async createResponse(r: FormResponse, userId: number) {
        const submittedAt = new Date().toLocaleString();

        try {
            await FormResponseByTeamModel.create({ ...r, userId, submittedAt });
        } catch (err: any) { }
    }
}
import { FormResponse, QuestionResponse, SubmittedResponse } from "@shared/schemas/data";
import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import FormModel from "./FormModel";
import { FormType } from "@shared/forms/Form";

@Table({ tableName: "form_responses_by_team" })
export default class FormResponseByTeamModel extends Model<InferAttributes<FormResponseByTeamModel>, InferCreationAttributes<FormResponseByTeamModel>> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: CreationOptional<number>;

    @Column({ type: DataType.INTEGER })
    userId!: number;

    @ForeignKey(() => FormModel)
    @Column({ type: DataType.STRING, onDelete: "SET NULL", allowNull: true })
    formId!: string;

    @Column({ type: DataType.INTEGER })
    team!: number;

    @Column({ type: DataType.INTEGER })
    match!: number;

    @Column({ type: DataType.JSON })
    responses!: QuestionResponse[];

    @Column({ type: DataType.STRING })
    submittedAt!: string;

    @Column({ type: DataType.FLOAT, defaultValue: null })
    accuracyScore!: number | null;

    public static async submitResponse(r: SubmittedResponse, userId: number) {
        if (r.type === FormType.ALLIANCE) {
            for (const response of r.responses) {
                FormResponseByTeamModel.createResponse(response, userId);
            }
        } else {
            FormResponseByTeamModel.createResponse(r.response, userId);
        }
    }

    private static async createResponse(r: FormResponse, userId: number) {
        const submittedAt = new Date().toLocaleString();

        try {
            await FormResponseByTeamModel.create({ ...r, userId, submittedAt });
        } catch (err: any) { }
    }
}
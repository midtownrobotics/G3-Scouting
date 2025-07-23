import { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import FormModel from "./FormModel";
import { QuestionResponse } from "@shared/schemas/data";

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

    public static async submitResponse(responses: QuestionResponse[], formId: string, userId: number, team: number, match: number) {
        try {
            await FormResponseByTeamModel.create({
                submittedAt: new Date().toString(),
                match,
                userId,
                formId,
                team,
                responses
            });
        } catch (err: any) { }
    }
}
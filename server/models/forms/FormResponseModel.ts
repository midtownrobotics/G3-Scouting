import { SerializedResponse } from "@shared/schemas/forms";
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import UserModel from "../users/UserModel";
import FormModel from "./FormModel";

@Table({ tableName: "form_responses" })
export default class FormResponseModel extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER })
    userId!: number;

    @BelongsTo(() => UserModel)
    user!: UserModel;

    @ForeignKey(() => FormModel)
    @Column({ type: DataType.STRING })
    formId!: string;

    @BelongsTo(() => FormModel)
    form!: FormModel;

    @Column({ type: DataType.JSON })
    response!: SerializedResponse;

    @CreatedAt
    createdAt!: Date;

    public static async submitResponse(response: SerializedResponse, formId: string, userId: number) {
        try {
            await FormResponseModel.create({
                response,
                formId,
                userId
            });
        } catch (err: any) {}
    }
}
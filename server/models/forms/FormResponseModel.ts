import { SerializedResponse } from "@shared/schemas/forms";
import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import UserModel from "../users/UserModel";
import FormModel from "./FormModel";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { DateString } from "@shared/types";
import { CreationOptional } from "sequelize";

@Table({ tableName: "form_responses" })
export default class FormResponseModel extends Model<InferAttributes<FormResponseModel>, InferCreationAttributes<FormResponseModel>> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: CreationOptional<number>;

    @Column({ type: DataType.INTEGER })
    userId!: number;

    @ForeignKey(() => FormModel)
    @Column({ type: DataType.STRING })
    formId!: string;

    @BelongsTo(() => FormModel)
    form!: CreationOptional<FormModel>;

    @Column({ type: DataType.JSON })
    response!: SerializedResponse;

    @CreatedAt
    createdAt!: CreationOptional<Date>;

    public static async submitResponse(response: SerializedResponse, formId: string, userId: number) {
        response.push(["UserId", userId.toString()])
        response.push(["SubmittedAt", Date.now().toString()])

        try {
            await FormResponseModel.create({
                response,
                formId,
                userId
            });
        } catch (err: any) { }
    }
}
import Form, { FormType } from "@shared/forms/Form";
import { SerializedComponent, SerializedForm } from "@shared/schemas/forms";
import { Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import FormResponseByTeamModel from "./FormResponseModels";
import { EquationComponent } from "@shared/schemas/virtualDataRecorder";

@Table({ tableName: "virtual_data_equations" })
export default class VirtualDataEquationModel extends Model<SerializedForm> {
    @Column({ type: DataType.STRING, primaryKey: true, autoIncrement: false })
    id!: string;

    @Column({ type: DataType.JSON })
    equation!: EquationComponent[]
    
    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}
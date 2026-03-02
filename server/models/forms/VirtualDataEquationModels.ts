import { FormType } from "@shared/forms/Form";
import { QuestionMetadata } from "@shared/schemas/data";
import { Equation } from "@shared/schemas/virtualDataRecorder";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "virtual_data_equations" })
export default class VirtualDataEquationModel extends Model<InferAttributes<VirtualDataEquationModel>, InferCreationAttributes<VirtualDataEquationModel>> {
    @Column({ type: DataType.STRING, primaryKey: true, autoIncrement: false })
    id!: string;

    @Column({ type: DataType.JSON })
    equation!: Equation

    public static async addEquation(id: string, equation: Equation) {
        if (await VirtualDataEquationModel.count({ where: {id} }) !== 0) return;
        return VirtualDataEquationModel.create({
            id,
            equation
        })
    }

    public toQuestion(): QuestionMetadata {
        return {
            classification: "quantitative",
            type: "number",
            formId: "VDR",
            formType: FormType.TEAM,
            id: this.id,
            name: this.id,
            namespaceId: `VDR-${this.id}`
        }
    }
}
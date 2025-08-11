import Form, { FormType } from "@shared/forms/Form";
import { SerializedComponent, SerializedForm } from "@shared/schemas/forms";
import { Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import FormResponseByTeamModel from "./FormResponseModels";

@Table({ tableName: "forms" })
export default class FormModel extends Model<SerializedForm> {
    @Column({ type: DataType.STRING, primaryKey: true, autoIncrement: false })
    id!: string;

    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    description!: string;

    @Column(DataType.BOOLEAN)
    deployed!: boolean;

    @Column(DataType.BOOLEAN)
    openSubmission!: boolean;

    @Column(DataType.INTEGER)
    maxComponentId!: number;

    @Column(DataType.TEXT)
    type!: FormType;

    @Column(DataType.JSON)
    components!: SerializedComponent[];

    @HasMany(() => FormResponseByTeamModel)
    responses!: FormResponseByTeamModel[];

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    public static async storeForm(form: Form | SerializedForm) {
        if (form instanceof Form) {
            await FormModel.upsert({
                ...form,
                components: form.getComponents().map(c => c.toJSON())
            });
        } else {
            await FormModel.upsert(form);
        }
    }

    public static async getForms(includeResponses?: boolean) {
        const models = await FormModel.findAll(includeResponses ? { include: { model: FormResponseByTeamModel, as: "responses" } } : undefined);
        return models.map(m => m.toForm());
    }

    public static async getForm(id: string, includeResponses?: boolean) {
        const model = await FormModel.findByPk(id, includeResponses ? { include: { model: FormResponseByTeamModel, as: "responses" } } : undefined);
        return model?.toForm();
    }

    public static async getSerializedForms(includeResponses?: boolean): Promise<SerializedForm[]> {
        const models = await FormModel.findAll(includeResponses ? { include: { model: FormResponseByTeamModel, as: "responses" } } : undefined);
        return models.map(m => m.toJSON());
    }

    public static async getSerializedForm(id: string, includeResponses?: boolean): Promise<SerializedForm | undefined> {
        const model = await FormModel.findByPk(id, includeResponses ? { include: { model: FormResponseByTeamModel, as: "responses" } } : undefined);
        return model?.toJSON();
    }

    public toForm(): Form {
        return Form.fromJSON(this.toJSON());
    }
}
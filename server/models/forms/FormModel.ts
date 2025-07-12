import Form from "@shared/forms/Form";
import { FormComponent } from "@shared/forms/FormComponents";
import { SerializedComponent, SerializedForm } from "@shared/schemas/forms";
import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "forms" })
export default class FormModel extends Model<SerializedForm> {
    @Column({ type: DataType.STRING, primaryKey: true, autoIncrement: false})
    id!: string;

    @Column(DataType.STRING)
    name!: string;

    @Column(DataType.STRING)
    description!: string;

    @Column(DataType.BOOLEAN)
    deployed!: boolean;

    @Column(DataType.INTEGER)
    maxComponentId!: number;

    @Column(DataType.JSON)
    components!: SerializedComponent[];

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    public static async storeForm(form: Form) {
        await FormModel.upsert({
            id: form.id,
            name: form.name,
            components: form.getComponents().map(c => c.toJSON()),
            maxComponentId: form.maxComponentId,
            deployed: form.deployed,
            description: form.description
        })
    }

    public static async getForms() {
        const models = await FormModel.findAll();
        return models.map(m => m.toForm())
    }

    public static async getForm(id: string) {
        const model = await FormModel.findByPk(id);
        return model?.toForm();
    }

    public static async getSerializedForms(): Promise<SerializedForm[]> {
        const models = await FormModel.findAll();
        return models.map(m => m.toJSON())
    }

    public static async getSerializedForm(id: string): Promise<SerializedForm | undefined> {
        const model = await FormModel.findByPk(id);
        return model?.toJSON()
    }

    public toForm(): Form {
        return Form.fromJSON(this);
    }
}
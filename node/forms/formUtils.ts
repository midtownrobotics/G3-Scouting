import { Model, ModelAttributes, ModelStatic } from "sequelize";
import sequelize from "../models/sequelize";
import { DataType } from "sequelize-typescript";
import Question from "./Question";
import { Form } from "./forms";

export function generateFormModel(id: string, questions: Question[], additionalAttributes: ModelAttributes = {}): ModelStatic<Model> {
    let modelAttributes = additionalAttributes;

    modelAttributes.id = { type: DataType.INTEGER, primaryKey: true, autoIncrement: true };
    modelAttributes.scout = { type: DataType.TEXT, allowNull: true };
    modelAttributes.scoutId = { type: DataType.INTEGER, allowNull: true };

    questions.forEach((q) => {
        modelAttributes[q.getId()] = {
            type: DataType.TEXT
        }
    })

    modelAttributes.timestamp = { type: DataType.TEXT, allowNull: true };

    return sequelize.define<Model>(id, modelAttributes, { timestamps: false });
}

export class FormRegistry {
    private static forms: Form[] = [];
    static getAll = () => this.forms
    static register(form: Form) {
        if (FormRegistry.forms.some(f => f.id == form.id)) return console.warn("Form with already registered ID detected, skipping registry.")
        FormRegistry.forms.push(form)
    };
}
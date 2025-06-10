import { Assignment, AssignmentType } from "@shared/schemas/schedule";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "assignments" })
class AssignmentModel extends Model<Assignment> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: false })
    declare id: number;

    @Column({ type: DataType.TEXT })
    declare type: AssignmentType;

    @Column({ type: DataType.TEXT })
    declare color: string;

    @Column({ type: DataType.TEXT })
    declare name: string;
}

export default AssignmentModel;
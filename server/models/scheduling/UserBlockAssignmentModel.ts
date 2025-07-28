import { InferAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import UserModel from "../users/UserModel";
import AssignmentModel from "./AssignmentModel";
import BlockModel from "./BlockModel";

@Table({ 
    tableName: "user_block_assignments", 
    defaultScope: {
        include: [
            {model: BlockModel, as: "block"}, 
            {model: AssignmentModel, as: "assignment"}
        ] 
    } 
})
class UserBlockAssignmentModel extends Model<
    InferAttributes<UserBlockAssignmentModel>,
    UserBlockAssignmentModelCreationAttributes
> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    declare id: number;

    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER, onDelete: "CASCADE" })
    declare userId: number;

    @ForeignKey(() => BlockModel)
    @Column({ type: DataType.INTEGER })
    declare blockId: number;

    @ForeignKey(() => AssignmentModel)
    @Column({ type: DataType.INTEGER })
    declare assignmentId: number;

    @BelongsTo(() => UserModel)
    declare user: UserModel;

    @BelongsTo(() => BlockModel, { as: "block" })
    declare block: BlockModel;

    @BelongsTo(() => AssignmentModel, { as: "assignment" })
    declare assignment: AssignmentModel;
}

export default UserBlockAssignmentModel;

type UserBlockAssignmentModelCreationAttributes = {
    userId: number;
    blockId: number;
    assignmentId: number;
}
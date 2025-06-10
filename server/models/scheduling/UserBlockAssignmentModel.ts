import { BelongsTo, Column, DataType, ForeignKey, Table, Model } from "sequelize-typescript";
import UserModel from "../users/UserModel";
import BlockModel from "./BlockModel";
import AssignmentModel from "./AssignmentModel";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({ tableName: "user_block_assignments" })
class UserBlockAssignmentModel extends Model<
    InferAttributes<UserBlockAssignmentModel>,
    UserBlockAssignmentModelCreationAttributes
> {
    @ForeignKey(() => UserModel)
    @Column({ type: DataType.INTEGER })
    declare userId: number;

    @ForeignKey(() => BlockModel)
    @Column({ type: DataType.INTEGER })
    declare blockId: number;

    @ForeignKey(() => AssignmentModel)
    @Column({ type: DataType.INTEGER })
    declare assignmentId: number;

    @BelongsTo(() => UserModel)
    declare user: UserModel;

    @BelongsTo(() => BlockModel)
    declare block: BlockModel;

    @BelongsTo(() => AssignmentModel)
    declare assignment: AssignmentModel;
}

export default UserBlockAssignmentModel;

type UserBlockAssignmentModelCreationAttributes = {
    userId: number;
    blockId: number;
    assignmentId: number;
}
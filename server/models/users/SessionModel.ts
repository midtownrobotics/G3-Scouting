import { InferAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "sessions" })
class SessionModel extends Model<InferAttributes<SessionModel>> {
    @Column({ type: DataType.TEXT, primaryKey: true, allowNull: false })
    declare token: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    public userId!: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    public expiresAt!: number;
}

export default SessionModel;
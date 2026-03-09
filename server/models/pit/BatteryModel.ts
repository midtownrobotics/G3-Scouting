import { BatteryData, BatteryState } from "@shared/schemas/pit";
import { Optional } from "sequelize";
import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";

@Table({ tableName: "batteries" })
export default class BatteryModel extends Model<BatteryData, Optional<BatteryData, "id">> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    @Column({ type: DataType.STRING })
    name!: string;

    @Column({ type: DataType.STRING })
    state!: BatteryState;

    @Column({ type: DataType.INTEGER })
    stateSince!: number;

    @Column({ type: DataType.DOUBLE })
    voltage!: number;
    
    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}
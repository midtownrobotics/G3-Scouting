import { Block } from "@shared/schemas/schedule";
import { DateString } from "@shared/types";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "blocks" })
class BlockModel extends Model<Block> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: false })
    declare id: number;

    @Column({ type: DataType.STRING })
    declare date: DateString;

    @Column({ type: DataType.INTEGER })
    declare time: number;
}

export default BlockModel;
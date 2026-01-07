import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table({ tableName: "lootboxes", timestamps: false})
export default class LootboxModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.INTEGER)
    declare cost: number;

    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @Column(DataType.STRING)
    declare description?: string;

    @Column(DataType.JSON)
    declare rarityChances: Record<string, number>;
}
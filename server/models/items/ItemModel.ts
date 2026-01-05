import { Rarity } from "@shared/utils";
import { AutoIncrement, Column, DataType, PrimaryKey, Table, Unique, Model } from "sequelize-typescript";

@Table({tableName: "items", timestamps: false})
export default class ItemModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Unique
    @Column(DataType.STRING)
    declare name: string;

    @Column(DataType.ENUM(...Object.values(Rarity)))
    declare rarity: Rarity;
}
import { Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript";
import UserModel from "../users/UserModel";
import ItemModel from "./ItemModel";

@Table({ tableName: "user_items", timestamps: false, indexes: [
    {
        unique: true,
        fields: ["userId", "itemId"],
        name: "user_item_unique"
    }
]})
export default class UserInventoryModel extends Model {
    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => ItemModel)
    @Column(DataType.INTEGER)
    declare itemId: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false})
    declare equipped: boolean;
}
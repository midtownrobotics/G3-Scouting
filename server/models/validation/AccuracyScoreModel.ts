
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import ScoutAccuracyScoreModel from "./ScoutAccuracyScoreModel";

@Table({
    tableName: "accuracy_scores",
    indexes: [
        {
            unique: true,
            name: "unique_match_alliance",
            fields: ["match", "alliance"]
        }
    ]
})
class AccuracyScoreModel extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number;

    @Column({ type: DataType.INTEGER, allowNull: false, unique: false })
    declare match: number;
    
    @Column({ type: DataType.ENUM('red', 'blue'), allowNull: false, unique: false })
    declare alliance: 'red' | 'blue';    
  
    @Column(DataType.FLOAT)
    declare score: number;

    @HasMany(() => ScoutAccuracyScoreModel)
    declare scouts: ScoutAccuracyScoreModel[];
}

export default AccuracyScoreModel;
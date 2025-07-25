import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import AccuracyScoreModel from "./AccuracyScoreModel";
import { InferCreationAttributes } from "sequelize";

@Table({ tableName: "scout_accuracy_scores", timestamps: false })
class ScoutAccuracyScoreModel extends Model<InferCreationAttributes<ScoutAccuracyScoreModel>> {
    @Column(DataType.INTEGER)
    declare userId: number;

    @ForeignKey(() => AccuracyScoreModel)
    @Column(DataType.INTEGER)
    declare accuracyScoreId: number;
}

export default ScoutAccuracyScoreModel;
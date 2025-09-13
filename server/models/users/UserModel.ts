import { Assignment } from "@shared/schemas/schedule";
import bcrypt from 'bcrypt';
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { getCurrentBlockId } from "@shared/utils";
import UserBlockAssignmentModel from "../scheduling/UserBlockAssignmentModel";
import { User, UserCreationAttributes } from "../types";
import { NextMatch } from "@shared/schemas/data";
import { Permission } from "@shared/permissions";

@Table({ tableName: "users", defaultScope: { include: [{ model: UserBlockAssignmentModel, as: "schedule" }] } })
class UserModel extends Model<User, UserCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number;

    @Column({ type: DataType.TEXT, allowNull: false, unique: true })
    public username!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    public slackId?: string | null;

    @Column({ type: DataType.TEXT, allowNull: false })
    public password!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    public permission!: Permission;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    public redAlliance!: boolean;

    @Column({ type: DataType.JSON, allowNull: true })
    public nextMatch?: NextMatch | null;

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
    public assignedMatches!: number[];

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
    public reliable!: boolean;

    @HasMany(() => UserBlockAssignmentModel, { as: "schedule" })
    public schedule!: UserBlockAssignmentModel[];

    public get slackLinked() {
        return this.slackId !== undefined && this.slackId !== null;
    }

    /**
     * Creates a user model.
     * @param username The user's username.
     * @param password The user's password.
     * @param permissionId The permission ID that the user will have.
     */
    public static async addUser(username: string, password: string, permission: Permission, reliable: boolean) {
        const [redCount, blueCount] = await Promise.all([
            UserModel.count({ where: { redAlliance: true } }),
            UserModel.count({ where: { redAlliance: false } }),
        ]);

        bcrypt.hash(password, 12, async function (err, hash) {
            if (!err) {
                await UserModel.create({
                    username,
                    permission,
                    reliable,
                    password: hash,
                    redAlliance: redCount < blueCount,
                    assignedMatches: []
                });
            }
        });
    }

    public getCurrentAssignment() {
        return this.getAssignment(getCurrentBlockId());
    }

    public async getAssignment(blockId: number): Promise<Assignment | undefined> {
        const fromMemory = this.schedule.find(a => a.blockId === blockId)?.assignment;
        if (fromMemory) return fromMemory.toJSON();

        const record = await UserBlockAssignmentModel.findOne({ where: { userId: this.id, blockId } });
        return record?.assignment?.toJSON();
    }
}

export default UserModel;
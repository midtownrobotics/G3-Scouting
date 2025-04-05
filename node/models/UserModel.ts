import { Column, DataType, Model, Table } from "sequelize-typescript";
import { User, UserCreationAttributes } from "./types";
import { Assignment, NextMatch } from "../types";
import * as uuid from "uuid";
import { sendMessage } from "../slack";
import ResponseModel from "./ResponseModel";
import { Op } from "sequelize";
import { getSettings } from "../storage";

@Table({ tableName: "users" })
class UserModel extends Model<User, UserCreationAttributes> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: number;

    @Column({ type: DataType.TEXT, allowNull: false })
    public username!: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    public slackLinkCode!: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    public slackId?: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    public password!: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    public permissionId!: number;

    @Column({ type: DataType.JSON, allowNull: true })
    public assignments?: Assignment[];

    @Column({ type: DataType.TEXT, allowNull: false })
    public assignedAlliance!: "blue" | "red";

    @Column({ type: DataType.JSON, allowNull: true })
    public nextMatch?: NextMatch;

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
    public assignedMatches!: number[];

    @Column({ type: DataType.INTEGER, allowNull: true })
    public lastMatchScouted?: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
    public reliable!: boolean;

    /**
     * Sends a slack DM to this user.
     * @param message The message to be sent.
     * @returns `true` user has {@link slackId} and `false` otherwise.
     */
    public sendSlackMessage(message: string): boolean {
        if (this.slackId) {
            sendMessage(this.slackId, message);
            return true;
        }
        return false;
    }

    /**
     * Calculates the percent of assigned matches scouted.
     * @returns Number of scouted matches / Number of assigned matches.
     */
    public async calculateReliability() {
        const assignedMatchesString = this.assignedMatches.map(num => num.toString());

        const submitted = (await ResponseModel.count({ where: { scoutId: this.id, matchNum: { [Op.in]: assignedMatchesString } }, distinct: true, col: 'matchNum' }));
        const ideal = this.assignedMatches.length;

        return {
            percent: submitted/ideal,
            submitted,
            ideal
        };
    }

    /**
     * Creates a user model.
     * @param username The user's username.
     * @param password The user's password.
     * @param permissionId The permission ID that the user will have.
     */
    public static async addUser(username: string, password: string, permissionId: number, reliable: boolean) {
        const [redCount, blueCount] = await Promise.all([
            UserModel.count({ where: { assignedAlliance: "red" } }),
            UserModel.count({ where: { assignedAlliance: "blue" } }),
        ]);

        await UserModel.create({
            username,
            password,
            permissionId,
            reliable,
            assignedAlliance: redCount < blueCount ? "red" : "blue",
            assignedMatches: [],
            slackLinkCode: uuid.v4()
        });
    }

    /** Resets all {@link assignedMatches} for all users. */
    public static async resetAssignedMatchData() {
        const allUsers = await UserModel.findAll();
        allUsers.forEach((u) => {
            u.update({ assignedMatches: [] })
        })
    }
}

export default UserModel;
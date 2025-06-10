import { DateString } from "@shared/types";
import AssignmentModel from "../models/scheduling/AssignmentModel";
import BlockModel from "../models/scheduling/BlockModel";
import UserBlockAssignmentModel from "../models/scheduling/UserBlockAssignmentModel";
import { managementDatabase } from "../models/sequelize";
import { DeployPayload } from "@shared/schemas/schedule";

/**
 * Deploys schedules to user models, creates assignment/block models, and destroys old models.
 * @param deployPayload The data payload to deploy the Schedules.
 * @returns `true` for success. `false` for error fail.
 */
export default async function deploySchedules(deployPayload: DeployPayload): Promise<boolean> {
    const transaction = await managementDatabase.transaction();

    try {
        await UserBlockAssignmentModel.destroy({ where: {}, transaction })
        await BlockModel.destroy({ where: {}, transaction })
        await AssignmentModel.destroy({ where: {}, transaction })

        await Promise.all(deployPayload.assignments.map(a =>
            AssignmentModel.create({ id: a.id, type: a.type, name: a.name, color: a.color }, { transaction })
        ));

        await Promise.all(deployPayload.blocks.map(b =>
            BlockModel.create({ id: b.id, date: b.date as DateString, time: b.time }, { transaction })
        ));

        for (const s of deployPayload.schedules) {
            await Promise.all(s.assignments.map(a =>
                UserBlockAssignmentModel.create({
                    userId: s.userId,
                    blockId: a.blockId,
                    assignmentId: a.assignmentId
                }, { transaction })
            ));
        }

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return false;
    }
}
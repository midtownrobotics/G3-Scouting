import { DateString } from "@shared/types";
import AssignmentModel from "../models/scheduling/AssignmentModel";
import BlockModel from "../models/scheduling/BlockModel";
import UserBlockAssignmentModel from "../models/scheduling/UserBlockAssignmentModel";
import { managementDatabase } from "../models/sequelize";
import { AssignmentType, DeployPayload } from "@shared/schemas/schedule";
import { Alliance } from "@shared/utils";

/**
 * Deploys schedules to user models, creates assignment/block models, and destroys old models.
 * @param deployPayload The data payload to deploy the Schedules.
 * @returns `true` for success. `false` for error fail.
 */
export default async function deploySchedules(
  deployPayload: DeployPayload
): Promise<boolean> {
  const transaction = await managementDatabase.transaction();

  try {
    await UserBlockAssignmentModel.destroy({ where: {}, transaction });
    await BlockModel.destroy({ where: {}, transaction });
    await AssignmentModel.destroy({ where: {}, transaction });

    await Promise.all(
      deployPayload.assignments.map((a) =>
        AssignmentModel.create(
          { id: a.id, type: a.type, name: a.name, color: a.color },
          { transaction }
        )
      )
    );

    await Promise.all(
      deployPayload.blocks.map((b) =>
        BlockModel.create(
          { id: b.id, date: b.date as DateString, time: b.time },
          { transaction }
        )
      )
    );

    for (const s of deployPayload.schedules) {
      await UserBlockAssignmentModel.bulkCreate(
        s.assignments.map((a) => ({
          userId: s.userId,
          blockId: a.blockId,
          assignmentId: a.assignmentId,
        })),
        { transaction, validate: true }
      );
    }

    const assignments = await UserBlockAssignmentModel.findAll({
      include: [
        {
          model: BlockModel,
          as: "block",
        },
        {
          model: AssignmentModel,
          as: "assignment",
        },
      ],
      order: [
        [{ model: BlockModel, as: "block" }, "date", "ASC"],
        [{ model: BlockModel, as: "block" }, "time", "ASC"],
      ],
      transaction,
    });

    const byBlock = new Map<number, UserBlockAssignmentModel[]>();

    for (const assignment of assignments) {
      const blockId = assignment.blockId;

      if (!byBlock.has(blockId)) {
        byBlock.set(blockId, []);
      }

      byBlock.get(blockId)!.push(assignment);
    }

    for (const [, blockAssignments] of byBlock) {
      let numBlueAssignments: number = 0;
      let numRedAssignments: number = 0;

      for (const assignment of blockAssignments) {
        if (assignment.assignment.type != AssignmentType.ASSIGNED) {
          continue;
        }
        if (numBlueAssignments < numRedAssignments) {
          assignment.scoutingAlliance = Alliance.BLUE;
          numBlueAssignments++;
          continue;
        }
        if (numBlueAssignments > numRedAssignments) {
          assignment.scoutingAlliance = Alliance.RED;
          numRedAssignments++;
          continue;
        }
        if ((assignment.userId + assignment.id) % 2 === 0) {
          assignment.scoutingAlliance = Alliance.BLUE;
          numBlueAssignments++;
          continue;
        }
        assignment.scoutingAlliance = Alliance.RED;
        numRedAssignments++;
      }

      await UserBlockAssignmentModel.bulkCreate(blockAssignments, {
        updateOnDuplicate: ["scoutingAlliance"],
        transaction,
      });
    }

    await transaction.commit();
    return true;
  } catch (err) {
    await transaction.rollback();
    console.error((err as any).sql);
    return false;
  }
}

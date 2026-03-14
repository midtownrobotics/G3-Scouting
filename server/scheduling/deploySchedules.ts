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

  console.log(deployPayload);

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

    const prevAlliance = new Map<number, Alliance>();

    for (const [, blockAssignments] of byBlock) {
      let numBlueAssignments: number = 0;
      let numRedAssignments: number = 0;


      for (const assignment of blockAssignments) {
        function assignBlue() {
          assignment.scoutingAlliance = Alliance.BLUE;
          numBlueAssignments++;
          prevAlliance.set(assignment.userId, Alliance.BLUE);
        }

        function assignRed() {
          assignment.scoutingAlliance = Alliance.RED;
          numRedAssignments++;
          prevAlliance.set(assignment.userId, Alliance.RED)
        }

        if (assignment.assignment.type != AssignmentType.ASSIGNED) {
          continue;
        }
        if (numBlueAssignments < numRedAssignments) {
          assignBlue();
          continue;
        }
        if (numBlueAssignments > numRedAssignments) {
          assignRed();
          continue;
        }
        if (prevAlliance.get(assignment.userId) == Alliance.BLUE && numBlueAssignments === numRedAssignments) {
          assignBlue();
          continue;
        }
        assignRed();
      }

      await Promise.all(
        blockAssignments.map((a) =>
          UserBlockAssignmentModel.update(
            { scoutingAlliance: a.scoutingAlliance },
            { where: { id: a.id }, transaction }
          )
        )
      );
    }

    await transaction.commit();
    return true;
  } catch (err) {
    await transaction.rollback();
    console.error((err as any).sql);
    return false;
  }
}

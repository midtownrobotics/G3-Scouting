import { Sequelize } from 'sequelize-typescript';
import UserModel from './users/UserModel';
import AssignmentModel from './scheduling/AssignmentModel';
import BlockModel from './scheduling/BlockModel';
import UserBlockAssignmentModel from './scheduling/UserBlockAssignmentModel';
import FormModel from './forms/FormModel';
import FormResponseByTeamModel from './forms/FormResponseModels';
import SessionModel from './users/SessionModel';
import BatteryModel from './battery/BatteryModel';
import VirtualDataEquationModel from './forms/VirtualDataEquationModels';

export const managementDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/management.db',
    models: [
        UserModel,
        AssignmentModel,
        BlockModel,
        UserBlockAssignmentModel,
        FormModel,
        FormResponseByTeamModel,
        SessionModel,
        BatteryModel,
        VirtualDataEquationModel
    ],
    logging: false
});
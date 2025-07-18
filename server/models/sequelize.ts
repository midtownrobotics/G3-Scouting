import { Sequelize } from 'sequelize-typescript';
import UserModel from './users/UserModel';
import AssignmentModel from './scheduling/AssignmentModel';
import BlockModel from './scheduling/BlockModel';
import UserBlockAssignmentModel from './scheduling/UserBlockAssignmentModel';
import FormModel from './forms/FormModel';
import FormResponseModel from './forms/FormResponseModel';
import SessionModel from './users/SessionModel';

export const managementDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/management.db',
    models: [
        UserModel,
        AssignmentModel,
        BlockModel,
        UserBlockAssignmentModel,
        FormModel,
        FormResponseModel,
        SessionModel
    ],
    logging: false
});
import { Sequelize } from 'sequelize-typescript';
import UserModel from './users/UserModel';
import AssignmentModel from './scheduling/AssignmentModel';
import BlockModel from './scheduling/BlockModel';
import UserBlockAssignmentModel from './scheduling/UserBlockAssignmentModel';
import FormModel from './forms/FormModel';

export const managementDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/management.db',
    models: [UserModel, AssignmentModel, BlockModel, UserBlockAssignmentModel, FormModel],
    logging: false
});
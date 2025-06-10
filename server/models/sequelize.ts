import { Sequelize } from 'sequelize-typescript';
import UserModel from './users/UserModel';
import AssignmentModel from './scheduling/AssignmentModel';
import BlockModel from './scheduling/BlockModel';
import UserBlockAssignmentModel from './scheduling/UserBlockAssignmentModel';

export const managementDatabase = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.db', // Path to the SQLite database file
    models: [UserModel, AssignmentModel, BlockModel, UserBlockAssignmentModel],
    logging: false
});
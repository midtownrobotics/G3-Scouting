import { Sequelize } from 'sequelize-typescript';
import UserModel from './users/UserModel';

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/database.db', // Path to the SQLite database file
    models: [UserModel],
    logging: false
});

export default sequelize;
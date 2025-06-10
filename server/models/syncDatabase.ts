import { PRODUCTION } from '@shared/constants';
import { managementDatabase } from './sequelize';

async function syncDatabase() {
    try {
        await managementDatabase.sync({ force: false, alter: !PRODUCTION }); // `force: false` prevents dropping the table if it exists
        console.log("Synced database succesfully!")
    } catch (error) {
        console.log('Error synchronizing database:' + error);
    }
}

export default syncDatabase;
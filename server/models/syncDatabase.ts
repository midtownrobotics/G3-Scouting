import { PRODUCTION } from '@shared/config';
import { managementDatabase } from './sequelize';

async function syncDatabase() {
    try {
        const data = await managementDatabase.sync({ force: false, alter: !PRODUCTION });
        console.log("Synced database succesfully!")
        return data;
    } catch (error) {
        console.log('Error synchronizing database: ' + error);
        return;
    }
}

export default syncDatabase;
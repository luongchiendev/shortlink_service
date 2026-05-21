import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'sys',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '123456',
    {
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: false,
    }
);

export default sequelize;

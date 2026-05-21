import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Url extends Model { }

Url.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        originalUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        shortCode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'urls',
        sequelize,
    }
);

export default Url;

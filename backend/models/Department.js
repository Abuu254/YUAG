const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
},{
    tableName: 'departments',
    timestamps: false,
});

module.exports = Department;
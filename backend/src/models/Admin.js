const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
  },
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: false,
  tableName: 'administradores',
});

module.exports = Admin; 
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Perfume = sequelize.define('Perfume', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Eau Fraiche', 'Cologne'),
    defaultValue: 'Eau de Parfum',
  },
  genero: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Unisex'),
    defaultValue: 'Unisex',
  },
  tamano: {
    type: DataTypes.STRING(20),
    defaultValue: '100ml',
  },
  imagen: {
    type: DataTypes.STRING(255),
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  tableName: 'perfumes',
});

module.exports = Perfume; 
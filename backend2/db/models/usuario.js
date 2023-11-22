'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany( models.reserva, { as:'usuario-reserva', foreignKey: 'id_usuario'})
    }
  }
  usuario.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    tipo_documento: DataTypes.STRING,
    nro_documento: DataTypes.STRING,
    correo: DataTypes.STRING,
    password: DataTypes.STRING,
    repetir_password: DataTypes.STRING,
    imagen_url: DataTypes.TEXT,
    idioma: DataTypes.STRING,
    prefijo: DataTypes.STRING,
    color: DataTypes.STRING,
    tipo_usuario: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuario',
  });
  return usuario;
};
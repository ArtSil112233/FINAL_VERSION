'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      tipo_documento: {
        type: Sequelize.STRING
      },
      nro_documento: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      repetir_password: {
        type: Sequelize.STRING
      },
      imagen_url: {
        type: Sequelize.TEXT
      },
      idioma: {
        type: Sequelize.STRING
      },
      prefijo: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      tipo_usuario: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
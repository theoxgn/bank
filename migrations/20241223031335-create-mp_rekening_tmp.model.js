'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dbt_mp_rekening', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      bankID: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'dbm_bank_account',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      usersID: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      nama_pemilik: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rekening_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_verif: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dbt_mp_rekening');
  }
};
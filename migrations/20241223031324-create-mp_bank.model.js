'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dbm_bank_account', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bank_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image_logo: {
        type: Sequelize.STRING,
        allowNull: true
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

    await queryInterface.addIndex('dbm_bank_account', ['bank_code'], {
      unique: true,
      name: 'idx_dbm_bank_account_code'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('dbm_bank_account', 'idx_dbm_bank_account_code');
    await queryInterface.dropTable('dbm_bank_account');
  }
};
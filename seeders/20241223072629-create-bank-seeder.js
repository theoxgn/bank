'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamp = new Date();
    const banks = [
      {
        id: uuidv4(),
        bank_name: 'Bank Central Asia',
        bank_code: 'BCA',
        image_logo: 'bca.png',
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Mandiri',
        bank_code: 'MANDIRI',
        image_logo: 'mandiri.png',
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Rakyat Indonesia',
        bank_code: 'BRI',
        image_logo: 'bri.png',
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: uuidv4(),
        bank_name: 'Bank Negara Indonesia',
        bank_code: 'BNI',
        image_logo: 'bni.png',
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp
      }
    ];

    await queryInterface.bulkInsert('dbm_bank_account', banks, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('dbm_bank_account', null, {});
  }
};
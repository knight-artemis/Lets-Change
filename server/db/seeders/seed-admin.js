'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Admins', [
      {
        login: 'admin',
        password: await bcrypt.hash('123456789', 10),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Admins', null)
  },
}

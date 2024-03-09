'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'first',
        email: '1@1.ru',
        password: await bcrypt.hash('1', 10),
      },
      {
        firstName: 'second',
        email: '2@2.ru',
        password: await bcrypt.hash('1', 10),
      },
      {
        firstName: 'third',
        email: '3@3.ru',
        password: await bcrypt.hash('1', 10),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null)
  },
}

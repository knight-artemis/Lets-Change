'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Things', [
      {
        userId: 'first',
        thingName: '1@1',
        description: await bcrypt.hash('123', 10),
        categoryId:
        thingAddress:
        
      },
      {
        userId: 'second',
        thingName: '2@3',
        description: await bcrypt.hash('123', 10),
        categoryId:
        thingAddress:
      },
      {
        userId: 'third',
        thingName: '3@3',
        description: await bcrypt.hash('123', 10),
        categoryId:
        thingAddress:
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Things', null)
  },
}

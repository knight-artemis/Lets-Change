'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Categories',
      [
        { categoryTitle: 'Игрушки' },
        { categoryTitle: 'Одежда' },
        { categoryTitle: 'Электроника' },
        { categoryTitle: 'Мебель' },
        { categoryTitle: 'Инструмент' },
        { categoryTitle: 'Музыка' },
        { categoryTitle: 'Услуги' },
        { categoryTitle: 'Билеты' },
        { categoryTitle: 'Купоны/Скидки' },
      ],
      {},
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {})
  },
}

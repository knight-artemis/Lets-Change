'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Categories',
      [
        { categoryTitle: 'Электроника' },
        { categoryTitle: 'Для детей' },
        { categoryTitle: 'Винтаж' },
        { categoryTitle: 'Книги' },
        { categoryTitle: 'Растения' },
        { categoryTitle: 'Одежда' },
        { categoryTitle: 'Мебель' },
        { categoryTitle: 'Инструмент' },
        { categoryTitle: 'Спорт' },
        { categoryTitle: 'Барахолка' },
      ],
      {},
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Categories', null, {})
  },
}

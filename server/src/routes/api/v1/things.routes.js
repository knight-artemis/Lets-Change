const router = require('express').Router()

const { User, Thing } = require('../../../../db/models')

router.get('/', async (req, res) => {
  try {
    const thingsRaw = await Thing.findAll({
      order: [['createdAt', 'ASC']],
    })

    const things = thingsRaw
      .map((thing) => thing.get({ plain: true }))
      .filter((thing) => thing.isApproved && !thing.inDeal)

    console.log('\n\n\n↓↓↓↓↓↓↓↓↓↓\n')
    console.log(things)
    console.log('\n↑↑↑↑↑↑↑↑↑↑\n\n\n')
  } catch (error) {
    console.error('Ошибка при получении объявлений', error)
    res.status(500).send('Ошибка сервера при получении объявлений')
  }
})

module.exports = router

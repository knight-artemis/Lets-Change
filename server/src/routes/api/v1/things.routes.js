const router = require('express').Router()

const { User, Thing } = require('../../../../db/models')

router.get('/', async (req, res) => {
  try {
    const thingsRaw = await Thing.findAll({
      attributes: [
        'id',
        'thingName',
        'categoryId',
        'thingAddress',
        'thingLat',
        'thingLon',
        'endDate',
      ],
      order: [['createdAt', 'ASC']],
    })
    console.log(new Date());

    const things = thingsRaw
      .map((thing) => thing.get({ plain: true }))
      .filter((thing) => thing.isApproved && !thing.inDeal)
    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении объявлений', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении объявлений' } })
  }
})
router.post('/', async (req, res) => {
  const { userId } = req.session
  //! я расчитываю, что приходит валидный объект
  //   const {
  //     thingName,
  //     description,
  //     categoryId,
  //     address,
  //     lat,
  //     lon,
  //     startDate,
  //     endDate,
  //   } = req.body

  try {
    const newThing = await Thing.create(req.body)
    res.status(201).json(newThing)
  } catch (error) {
    console.error('Ошибка при создании объявления', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при создании объявления' } })
  }
})

module.exports = router

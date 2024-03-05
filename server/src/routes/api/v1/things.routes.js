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
    // console.log(new Date())

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
  const { userId } = req.session || 1
  //! я расчитываю, что приходит валидный объект
  //   const {
  //     thingName,
  //     description,
  //     categoryId,
  //     thingAddress,
  //     thingLat,
  //     thingLon,
  //     startDate,
  //     endDate,
  //   } = req.body

  // тест объявление
  //   {
  //     "userId": 1,
  //     "thingName": "title",
  //     "description": "description",
  //     "categoryId": 1,
  //     "thingAddress": "address",
  //     "thingLat": 60.486998,
  //     "thingLon": 58.640202,
  //     "endDate": "2024-04-05T11:42:58.415Z"
  //   }

  try {
    const newThing = await Thing.create({ ...req.body })
    res.status(201).json(newThing)
  } catch (error) {
    console.error('Ошибка при создании объявления', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при создании объявления' } })
  }
})

module.exports = router

const router = require('express').Router()

const { User, Thing, Category, Photo } = require('../../../../db/models')

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
      include: {
        model: Photo,
        attributes: ['photoUrl'],
        order: [['id', 'ASC']],
      },
      order: [['createdAt', 'ASC']],
    })

    const things = thingsRaw
      //! РАСКОМЕНТИТЬ !! это пока проверка, пока не апрувленные (фолс по умолчанию) объявления
      // .filter((thing) => thing.isApproved && !thing.inDeal)
      .map((thing) => {
        const plainThing = thing.get({ plain: true })
        const photoUrl = thing.Photos.length > 0 ? thing.Photos[0].photoUrl : null
        delete plainThing.Photos
        return { ...plainThing, photoUrl }
      })
    console.log('🚀 ~ router.get ~ things:', things)
    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении объявлений', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении объявлений' } })
  }
})
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const thingRaw = await Thing.findOne({
      where: { id },
      attributes: [
        'id',
        'userId',
        'categoryId',
        'thingName',
        'description',
        'thingAddress',
        'thingLat',
        'thingLon',
        'startDate',
        'endDate',
        'isApproved',
        'inDeal',
      ],
      include: [
        {
          model: User,
          attributes: ['firstName', 'middleName', 'lastName'],
        },
        {
          model: Category,
          attributes: ['categoryTitle'],
        },
        {
          model: Photo,
          attributes: ['photoUrl'],
        },
      ],
    })

    if (thingRaw) {
      const things = thingRaw.get({ plain: true })
      res.status(200).json(things)
    } else {
      res.status(404).send({ err: { notfound: 'нет такой записи' } })
    }
  } catch (error) {
    console.error('Ошибка при получении объявления', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении объявления' } })
  }
})

router.post('/', async (req, res) => {
  const { userId } = req.session
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
    const newThing = await Thing.create({ userId, ...req.body })
    res.status(201).json(newThing)
  } catch (error) {
    console.error('Ошибка при создании объявления', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при создании объявления' } })
  }
})

module.exports = router

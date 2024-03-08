const router = require('express').Router()
const { Deal, ThingDeal, Thing, User, Photo } = require('../../../../db/models')

router.post('/', async (req, res) => {
  const { thingId, things } = req.body
  console.log('попал в пост', thingId, things)
  const { user } = req.session
  try {
    const newDeal = await Deal.create({ thingId, initiatorId: user.id })
    const promises = things.map(async (item) => {
      const newThingDeal = await ThingDeal.create({
        dealId: newDeal.id,
        offeredThingId: item,
      })
      const thing = await Thing.findByPk(item)
      thing.inDeal = true
      await thing.save()
      return newThingDeal
    })
    await Promise.all(promises)
    res.status(201).json(newDeal)
  } catch (error) {
    console.error('Ошибка при создании сделки', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при создании сделки' } })
  }
})

router.get('/user/:id', async (req, res) => {
  const { user } = req.session
  try {
    const rawFromMeDeals = await Deal.findAll({
      where: {
        initiatorId: user.id,
      },
      include: [
        {
          model: Thing,
          attributes: ['thingName'],
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName'],
            },
            {
              model: Photo,
              attributes: ['photoUrl'],
            },
          ],
        },
      ],
      attributes: [
        'id',
        'thingId',
        'status',
        'initiatorId',
        'acceptedByInitiator',
        'acceptedByReceiver',
        'initiatorNote',
      ],
    })
    const rawToMeDeals = await Deal.findAll({
      include: [
        {
          model: Thing,
          where: {
            userId: user.id,
          },
          attributes: ['thingName'],
          include: [
            {
              model: Photo,
              attributes: ['photoUrl'],
            },
          ],
        },
        {
          model: User,
          attributes: ['firstName', 'lastName'],
        },
      ],
      attributes: [
        'id',
        'thingId',
        'status',
        'initiatorId',
        'acceptedByInitiator',
        'acceptedByReceiver',
        'recieverNote',
      ],
    })

    const fromMeDeals = rawFromMeDeals.map((el) => {
      const plainDeal = el.get({ plain: true })
      const { photoUrl } = plainDeal.Thing.Photos[0]
      const lastName = plainDeal.Thing.User.lastName || ''
      const recieverName = `${plainDeal.Thing.User.firstName} ${lastName}`.trim()
      delete plainDeal.Thing.User
      delete plainDeal.Thing.Photos
      plainDeal.Thing.photoUrl = photoUrl
      return { ...plainDeal, recieverName }
    })

    const toMeDeals = rawToMeDeals.map((el) => {
      const plainDeal = el.get({ plain: true })
      const { photoUrl } = plainDeal.Thing.Photos[0]
      const lastName = plainDeal.User.lastName || ''
      const initiatorName = `${plainDeal.User.firstName} ${lastName}`.trim()
      delete plainDeal.User
      delete plainDeal.Thing.Photos
      plainDeal.Thing.photoUrl = photoUrl
      return { ...plainDeal, initiatorName }
    })

    res.json({ fromMeDeals, toMeDeals })
  } catch (error) {
    console.error('Ошибка при получении моих сделок', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении моих сделок' } })
  }
})

router.get('/initiate-by-me', async (req, res) => {
  const { user } = req.session
  console.log(user.id)
  try {
    const deals = await Deal.findAll({
      where: { initiatorId: user.id },
      attributes: ['id', 'thingId'],
    })
    console.log(deals.map((el) => el.get({ plain: true })))
	res.json(deals)
  } catch (error) {
    console.error('Ошибка при получении сделок инициированных мной', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении сделок инициированных мной' } })
  }
})

module.exports = router

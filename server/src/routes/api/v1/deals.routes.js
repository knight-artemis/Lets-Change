const router = require('express').Router()
const { where } = require('sequelize')
const { Deal, ThingDeal, Thing, User, Photo, Message } = require('../../../../db/models')

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
  const { id } = req.params
  try {
    const rawFromMeDeals = await Deal.findAll({
      where: {
        initiatorId: id,
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
            userId: id,
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

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const rawDeal = await Deal.findByPk(id, {
      include: [
        {
          model: Thing,
          attributes: ['thingName'],
          include: [
            {
              model: Photo,
              attributes: ['photoUrl'],
            },
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        },
        {
          model: ThingDeal,
          include: {
            model: Thing,
            attributes: ['thingName'],
            include: {
              model: Photo,
              attributes: ['photoUrl'],
            },
          },
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
        'initiatorNote',
        'acceptedByReceiver',
        'recieverNote',
      ],
    })
    if (rawDeal) {
      const deal = rawDeal?.get({ plain: true })
      let lastName = deal.Thing.User.lastName || ''
      const recieverName = `${deal.Thing.User.firstName} ${lastName}`.trim()
      lastName = deal.User.lastName || ''
      const initiatorName = `${deal.User.firstName} ${lastName}`.trim()
      const { photoUrl } = deal.Thing.Photos[0]
      const receiverId = deal.Thing.User.id
      const initiatorThings = deal.ThingDeals.map((el) => ({
        id: el.offeredThingId,
        thingName: el.Thing.thingName,
        photoUrl: el.Thing.Photos[0].photoUrl,
        isSelected: el.isSelected,
      }))
      deal.Thing.photoUrl = photoUrl
      delete deal.User
      delete deal.ThingDeals
      delete deal.Thing.Photos
      delete deal.Thing.User
      res.json({
        ...deal,
        receiverId,
        recieverName,
        initiatorName,
        initiatorThings,
      })
    } else {
      res.json(rawDeal)
    }
  } catch (error) {
    console.error('Ошибка при получении сделки', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении сделки' } })
  }
})

router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  try {
    const deal = await Deal.findByPk(id)
    if (body.selectedThingId) {
      const selectedThing = await ThingDeal.findAll({
        where: { dealId: id },
      })
      const promises = selectedThing.map(async (el) => {
        const plainSelectedThing = el
        // console.log(plainSelectedThing)
        if (plainSelectedThing.offeredThingId === body.selectedThingId) {
          plainSelectedThing.isSelected = true
          await plainSelectedThing.save()
          //   console.log(plainSelectedThing.get({ plain: true }))
        } else {
          const thing = await Thing.findByPk(plainSelectedThing.offeredThingId)
          thing.inDeal = false
          await thing.save()
          console.log(thing.get({ plain: true }))
        }
        return plainSelectedThing
        // console.log(plainSelectedThing)
      })
      await Promise.all(promises)
      const thing = await Thing.findByPk(deal.thingId)
      thing.inDeal = true
      await thing.save()
      delete body.selectedThingId
    }
    await deal.update(body)
    res.json(deal)
  } catch (error) {
    console.error('Ошибка при обновлении сделки', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при обновлении сделки' } })
  }
})

router.patch('/:id/note', async (req, res) => {
  console.log('PATCH NOTE', req.body)
  try {
    const deal = await Deal.findByPk(req.params.id)
    await deal.update(req.body)
    res.sendStatus(200)
  } catch (error) {
    console.error('Ошибка при обновлении сделки', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при обновлении сделки' } })
  }
})

router.get('/:dealId/messages', async (req, res) => {
  const { dealId } = req.params
  try {
    const rawMessages = await Message.findAll({
      where: { dealId },
      include: { model: User, attributes: ['firstName', 'lastName'] },
      attributes: ['id', 'userId', 'text', 'createdAt'],
      order: [['createdAt', 'DESC']],
    })
    const messages = rawMessages.map((el) => {
      const msg = el.get({ plain: true })
      const lastName = msg.User.lastName || ''
      const userName = `${msg.User.firstName} ${lastName}`.trim()
      delete msg.User
      return { ...msg, userName }
    })
    res.json(messages)
  } catch (error) {
    console.error('Ошибка при получении сообщений', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении сообщений' } })
  }
})

router.post('/:dealId/messages', async (req, res) => {
  const { dealId } = req.params
  try {
    const rawMessage = await Message.create({ ...req.body, dealId })
    const message = rawMessage.get({ plain: true })
    const user = await User.findByPk(message.userId, { attributes: ['firstName', 'lastName'] })
    const lastName = user.lastName || ''
    const userName = `${user.firstName} ${lastName}`.trim()
    delete message.updatedAt
    res.json({ ...message, userName })
  } catch (error) {
    console.error('Ошибка при получении сообщений', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении сообщений' } })
  }
})

module.exports = router

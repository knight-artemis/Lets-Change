const router = require('express').Router()
const upload = require('../../../../multer')
const { User, Thing, Category, Photo } = require('../../../../db/models')
const { stripThings } = require('../../../services/things')

router.get('/categories', async (req, res) => {
  try {
    const categoriesRaw = await Category.findAll({})
    const categories = categoriesRaw.map((category) => ({
      id: category.id,
      categoryTitle: category.categoryTitle,
    }))
    res.status(200).json(categories)
  } catch (error) {
    console.error('Ошибка при поиске категорий', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при поиске категорий' } })
  }
})

router.get('/categories/:id', async (req, res) => {
  const { id } = req.params
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
        'isApproved',
        'inDeal',
      ],
      include: [
        {
          model: Photo,
          attributes: ['photoUrl'],
          order: [['createdAt', 'ASC']],
        },
        {
          model: Category,
          attributes: ['id'],
          where: { id },
        },
      ],
      order: [['createdAt', 'ASC']],
    })

    const things = stripThings(thingsRaw)
    res.status(200).json(things)
  } catch (error) {
    console.error(
      'Ошибка при получении объявлений в конкретной категории',
      error,
    )
    res.status(500).send({
      err: {
        server:
          'Ошибка сервера при получении объявлений в конкретной категории',
      },
    })
  }
})

router.get('/user/:id', async (req, res) => {
  const { id } = req.params
  try {
    const thingsRaw = await Thing.findAll({
      attributes: [
        'id',
        'userId',
        'categoryId',
        'thingName',
        'endDate',
        'isApproved',
        'inDeal',
      ],
      include: [
        {
          model: User,
          where: { id },
          attributes: ['id', 'firstName', 'middleName', 'lastName'],
        },
        {
          model: Photo,
          attributes: ['photoUrl'],
          order: [['createdAt', 'ASC']],
        },
        {
          model: Category,
          attributes: ['categoryTitle'],
        },
      ],
      order: [['createdAt', 'ASC']],
    })

    const things = stripThings(thingsRaw, { filter: false })
    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении всех объявлений', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении всех объявлений' } })
  }
})
router.get('/', async (req, res) => {
  try {
    const thingsRaw = await Thing.findAll({
      attributes: [
        'id',
        'userId',
        'thingName',
        'categoryId',
        'thingAddress',
        'thingLat',
        'thingLon',
        'endDate',
        'isApproved',
        'inDeal',
      ],
      include: {
        model: Photo,
        attributes: ['photoUrl'],
        order: [['createdAt', 'ASC']],
      },
      order: [['createdAt', 'ASC']],
    })

    const things = stripThings(thingsRaw)
    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении всех объявлений', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при получении всех объявлений' } })
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
          attributes: ['id', 'photoUrl', 'createdAt'],
          order: [['createdAt', 'ASC']],
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
    console.error('Ошибка при получении одного объявления', error)
    res.status(500).send({
      err: { server: 'Ошибка сервера при получении одного объявления' },
    })
  }
})

router.post('/', upload.array('photo', 10), async (req, res) => {
  const { user } = req.session
  try {
    console.log({ userId: user.id, ...req.body })
    const newThing = (await Thing.create({ userId: user.id, ...req.body })).get(
      { plain: true },
    )
    const promises = req.files.map(async (item) => {
      const newPhoto = await Photo.create({
        thingId: newThing.id,
        photoUrl: item.filename,
      })
      return newPhoto
    })
    await Promise.all(promises)
    res.status(201).json(newThing)
  } catch (error) {
    console.error('Ошибка при создании объявления', error)
    res
      .status(500)
      .send({ err: { server: 'Ошибка сервера при создании объявления' } })
  }
})

module.exports = router

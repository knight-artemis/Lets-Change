const router = require('express').Router()
const upload = require('../../../../multerForThings')
const { User, Thing, Category, Photo, Issue } = require('../../../../db/models')
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
    res.status(500).send({ err: { server: 'Ошибка сервера при поиске категорий' } })
  }
})

router.get('/categories/:id', async (req, res) => {
  const { id } = req.params
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
    console.error('Ошибка при получении объявлений в конкретной категории', error)
    res.status(500).send({
      err: {
        server: 'Ошибка сервера при получении объявлений в конкретной категории',
      },
    })
  }
})

router.get('/user/:id', async (req, res) => {
  console.log('Мама, я в ручке');
  console.log(req.params, 'Я рек парамс');
  const { id } = req.params
  console.log(id, 'Мама, я айдишник');
  try {
    const thingsRaw = await Thing.findAll({
      attributes: ['id', 'userId', 'categoryId', 'thingName', 'endDate', 'isApproved', 'inDeal'],
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
        {
          model: Issue,
          attributes: ['issue'],
        },
      ],
      order: [['createdAt', 'ASC']],
    })

    const things = stripThings(thingsRaw, { filter: false }).map((el) => {
      const thing = el
      if (thing.Issues.length) {
        const { issue } = thing.Issues[0]
        thing.issue = issue
      }
      delete thing.Issues
      return thing
    })
    console.log(things, 'Мама, мы вещи на отправку');
    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении всех объявлений', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении всех объявлений' } })
  }
})

router.get('/', async (req, res) => {
  const { query } = req
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
        'description',
      ],
      include: [
        {
          model: Photo,
          attributes: ['id', 'photoUrl'],
          order: [['createdAt', 'ASC']],
        },
        {
          model: Issue,
          attributes: ['issue'],
        },
      ],
      order: [['createdAt', 'ASC']],
    })

    const things = stripThings(thingsRaw)
    console.log(thingsRaw.map((el) => el.get({ plain: true })))
    res.status(200).json(
      query.admin
        ? thingsRaw.map((el) => {
          const thing = el.get({ plain: true })
          if (thing.Issues.length) {
            const { issue } = thing.Issues[0]
            thing.issue = issue
          }
          delete thing.Issues
          return thing
        })
        : things,
    )
  } catch (error) {
    console.error('Ошибка при получении всех объявлений', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении всех объявлений' } })
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
        {
          model: Issue,
          attributes: ['issue'],
        },
      ],
    })
    // console.log(thingRaw)
    if (thingRaw) {
      const thing = thingRaw.get({ plain: true })
      if (thing.Issues.length) {
        const { issue } = thing.Issues[0]
        thing.issue = issue
      }
      delete thing.Issues
      res.status(200).json(thing)
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
    const newThing = (await Thing.create({ userId: user.id, ...req.body })).get({ plain: true })
    const promises = req.files.map(async (item, index) => {
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
    res.status(500).send({ err: { server: 'Ошибка сервера при создании объявления' } })
  }
})

router.put('/:id', upload.array('newPhotos', 10), async (req, res) => {
  try {
    console.log(req.body.newPhoto, 'Я новые фотки');
    const rawData = req.body
    const updatedInfo = {
      ...rawData, thingLat: Number(rawData.thingLat), thingLon: Number(rawData.thingLon), categoryId: Number(rawData.categoryId),
    }
    console.log('🚀 ~ router.put ~ updatedInfo:', updatedInfo)
    const oldThing = await Thing.findByPk(req.params.id)
    console.log('🚀 ~ router.put ~ oldThing:', oldThing)
    await oldThing.update(updatedInfo)
    const finalThing = oldThing.get({ plain: true })
    await Photo.destroy({ where: { thingId: req.params.id } })
    if (req.body.photos) {
      const reqPhotos = req.body.photos
      const finReqPhotos = reqPhotos.map((el) => (
        {
          photoUrl: el, thingId: Number(req.params.id), createdAt: new Date(), updatedAt: new Date(),
        }
      ))
      const promises1 = finReqPhotos.map(async (item) => {
        const newPhoto = await Photo.create(item)
        return newPhoto
      })
      await Promise.all(promises1)
    }
    if (req.files.length) {
      const promises2 = req.files.map(async (item, index) => {
        const newPhoto = await Photo.create({
          thingId: req.params.id,
          photoUrl: item.filename,
        })
        return newPhoto
      })
      await Promise.all(promises2)
    }
    res.status(200).json(finalThing)
  } catch (error) {
    res.status(500).json({ err: error })
  }
})

module.exports = router

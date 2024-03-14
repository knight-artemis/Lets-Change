const router = require('express').Router()
const upload = require('../../../../multerForThings')
const {
  User, Thing, Category, Photo, Issue,
} = require('../../../../db/models')
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
      attributes: ['id', 'userId', 'categoryId', 'thingName', 'isApproved', 'inDeal', 'thingAddress', 'endDate', 'description'],
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

router.get('/search', async (req, res) => {
  const { search } = req.query
  console.log(typeof search, 'search', search);
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
          // order: [['createdAt', 'ASC']],
        },
        {
          model: Issue,
          attributes: ['issue'],
        },
      ],
      order: [['createdAt', 'ASC']],
    })
    const things = stripThings(thingsRaw)
      .filter((el) => {
        console.log(search.toLowerCase());
        console.log(`${el.thingName}${el.description}`.toLowerCase())
        console.log(`${el.thingName}${el.description}`.toLowerCase().includes(search.toLowerCase()))
        // console.log(search.toLowerCase().includes(`${el.thingName}${el.description}`.toLowerCase()));
        if (el.inDeal || !el.isApproved) return false
        if (!`${el.thingName}${el.description}`.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
    // .map((el) => el.id)

    res.status(200).json(things)
  } catch (error) {
    console.error('Ошибка при получении объявлений по поиску', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении объявлений по поиску' } })
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
    // console.log(thingsRaw.map((el) => el.get({ plain: true })))
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
    const rawData = req.body
    const updatedInfo = {
      ...rawData,
      thingLat: Number(rawData.thingLat),
      thingLon: Number(rawData.thingLon),
      categoryId: Number(rawData.categoryId),
    }
    await Photo.destroy({ where: { thingId: req.params.id } })
    if (req.body.photos) {
      const reqPhotos = req.body.photos
      if (typeof reqPhotos === 'object') {
        const finReqPhotos = reqPhotos.map((el) => ({
          photoUrl: el,
          thingId: Number(req.params.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        const promises1 = finReqPhotos.map(async (item) => {
          const newPhoto = await Photo.create(item)
        })
        await Promise.all(promises1)
      } else if (typeof reqPhotos === 'string') {
        const finReqPhotos = {
          photoUrl: reqPhotos,
          thingId: Number(req.params.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        console.log(finReqPhotos, 'Я фотка для записи');
        const newPhoto = await Photo.create(finReqPhotos)
        console.log(newPhoto, 'Я записанная в бд фотка')
      }
    }
    if (req.files.length) {
      console.log('Попали в иф для загрузки файлов');
      const promises2 = req.files.map(async (item, index) => {
        const newPhoto = await Photo.create({
          thingId: req.params.id,
          photoUrl: item.filename,
        })
        return newPhoto
      })
      await Promise.all(promises2)
    }
    const oldThing = await Thing.findByPk(req.params.id)
    await oldThing.update(updatedInfo)
    const prefinalThing = oldThing.get({ plain: true })
    console.log('🚀 ~ router.put ~ prefinalThing:', prefinalThing)
    const category = await Category.findOne({ where: { id: prefinalThing.categoryId } })
    const finCategory = category.get({ plain: true })
    console.log('🚀 ~ router.put ~ finCategory:', finCategory)
    const newPhotos = await Photo.findAll({ where: { thingId: prefinalThing.id } })
    const finNewPhotos = newPhotos.map((el) => el.get({ plain: true }))
    console.log('🚀 ~ router.put ~ finNewPhotos:', finNewPhotos)
    const user = await User.findOne({ where: { id: prefinalThing.userId } })
    const finalUser = user.get({ plain: true })
    console.log('🚀 ~ router.put ~ finalUser:', finalUser)
    console.log(finalUser, 'Я инфа о юзере!!!');
    const finalThing = {
      ...prefinalThing, Category: { categoryTitle: finCategory.categoryTitle }, Photos: finNewPhotos, User: { firstName: finalUser.firstName, middleName: finalUser.middleName, lastName: finalUser.lastName },
    }
    console.log(finalThing, 'Я финальная вещь');
    res.status(200).json(finalThing)
  } catch (error) {
    res.status(500).json({ err: error })
  }
})

module.exports = router

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
  const { id } = req.params
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

// router.put('/:id', upload.array('photo', 10), async (req, res) => {
//   try {
//     const oldThing = await Thing.findByPk(req.params.id)
//     await oldThing.update(req.body)
//     const finalThing = oldThing.get({ plain: true })
//     const existingPhotoUrls = finalThing.Photos.map((photo) => photo.photoUrl);
//     if (req.body.Photos) {
//       const newPhotoUrls = req.body.Photos.map((photo) => photo.photoUrl);
//       const photoUrlsToDelete = existingPhotoUrls.filter((url) => !newPhotoUrls.includes(url));
//       await Photo.destroy({ where: { photoUrl: { $in: photoUrlsToDelete } } });
//     }
//     res.status(200).json(finalThing)
//   } catch (error) {
//     res.status(500).json({ err: error })
//   }
// })

// router.put('/:id', upload.array('photo', 10), async (req, res) => {
//   try {
//     const oldThing = await Thing.findByPk(req.params.id);
//     if (!oldThing) {
//       res.status(404).json({ error: 'Thing not found' });
//     }
//     await oldThing.update(req.body);
//     const finalThing = oldThing.get({ plain: true });
//     if (req.body.Photos) {
//       const existingPhotoUrls = await Photo.findAll({ where: { thingId: req.params.id } }).map((photo) => photo.photoUrl);
//       const newPhotoUrls = req.body.Photos.map((photo) => photo.photoUrl);
//       const photoUrlsToDelete = existingPhotoUrls.filter((url) => !newPhotoUrls.includes(url));
//       await Photo.destroy({ where: { photoUrl: { $in: photoUrlsToDelete }, thingId: req.params.id } });
//     }
//     res.status(200).json(finalThing);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.put('/:id', upload.array('photo', 10), async (req, res) => {
//   try {
//     const oldThing = await Thing.findByPk(req.params.id);
//     if (!oldThing) {
//       res.status(404).json({ error: 'Thing not found' });
//     }
//     await oldThing.update(req.body);
//     const finalThing = oldThing.get({ plain: true });
//     if (req.body.Photos) {
//       const existingPhotos = await Photo.findAll({ where: { thingId: req.params.id } });
//       if (existingPhotos) {
//         const existingPhotoUrls = existingPhotos.map((photo) => photo.photoUrl);
//         const newPhotoUrls = req.body.Photos.map((photo) => photo.photoUrl);
//         const photoUrlsToDelete = existingPhotoUrls.filter((url) => !newPhotoUrls.includes(url));
//         if (photoUrlsToDelete.length > 0) {
//           await Photo.destroy({ where: { photoUrl: { $in: photoUrlsToDelete }, thingId: req.params.id } });
//         }
//       }
//     }
//     res.status(200).json(finalThing);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.put('/:id', upload.array('photo', 10), async (req, res) => {
//   try {
//     const oldThing = await Thing.findByPk(req.params.id);
//     if (!oldThing) {
//       res.status(404).json({ error: 'Thing not found' });
//     }
//     await oldThing.update(req.body);
//     const finalThing = oldThing.get({ plain: true });
//     if (req.body.Photos && req.body.Photos.length > 0) {
//       const existingPhotos = await Photo.findAll({ where: { thingId: req.params.id } });
//       if (existingPhotos.length > 0) {
//         const existingPhotoUrls = existingPhotos.map((photo) => photo.photoUrl);
//         const newPhotoUrls = req.body.Photos.map((photo) => photo.photoUrl);
//         const photoUrlsToDelete = existingPhotoUrls.filter((url) => !newPhotoUrls.includes(url));
//         if (photoUrlsToDelete.length > 0) {
//           await Photo.destroy({ where: { photoUrl: { [Op.in]: photoUrlsToDelete }, thingId: req.params.id } });
//         }
//       }
//     } else {
//       await Photo.destroy({ where: { thingId: req.params.id } });
//     }
//     res.status(200).json(finalThing);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router

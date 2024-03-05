const router = require('express').Router()
const upload = require('../../../../multer')

const { Photo } = require('../../../../db/models')

router.post('/testUpload', upload.array('photo', 10), async (req, res) => {
  try {
    const promises = req.files.map(async (item) => {
      const newPhoto = await Photo.create({
        thingId: 6,
        photoUrl: `http://localhost:${process.env.PORT}/uploads/things/${item.filename}`,
      })
      return newPhoto
    })
    await Promise.all(promises)
    res.status(200).json({ message: 'Upload successful' })
  } catch (error) {
    console.log(error, 'Все плохо, ошибка в ручке')
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router

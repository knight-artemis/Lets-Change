const router = require('express').Router()
const upload = require('../../../../multer')

const { Photo } = require('../../../../db/models')

router.post('/testUpload', upload.array('photo', 10), async (req, res) => {
  console.log('FILES', req.files)
  console.log('BODY', req.body)
  try {
    const promises = req.files.map(async (item) => {
      const newPhoto = await Photo.create({
        thingId: 2,
        photoUrl: item.filename,
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

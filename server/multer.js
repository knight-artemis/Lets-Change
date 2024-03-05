const multer = require('multer')
const { dirname } = require('path')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/uploads/things/`)
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
    || file.mimetype === 'image/gif'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports = upload

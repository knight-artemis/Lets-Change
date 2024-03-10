const multer = require('multer')
const { dirname } = require('path')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/public/uploads/avatars/`)
  },
  filename(req, file, cb) {
    cb(null, `${Date.now().toString().replace(' ', '_')}.${file.originalname.split('.').at(-1)}`)
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

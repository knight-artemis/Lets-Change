const router = require('express').Router()

router.post('/', (req, res) => {
  console.log('попал в пост', req.body)
  res.sendStatus(200)
})
module.exports = router

const router = require('express').Router()

const bcrypt = require('bcrypt');
const { User } = require('../../../../db/models')

// router.put('/avatarUpload', async (req, res) => {

// })

// router.put('/initialsUpd', async (req, res) => {

// })

// router.put('/emailUpd', async (req, res) => {

// })

//! ручка с адресом на холде

// router.put('/addressUpd', async (req, res) => {

// })

router.put('/passUpd', async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const { user } = req.session
  const reqUser = await User.findOne({ where: { id: user.id } })
  const finUser = reqUser.get({ plain: true })
  if (await bcrypt.compare(oldPassword, finUser.password)) {
    console.log('сравнение прошло успешно');
  } else {
    console.log('Что-то пошло не так');
  }
})

module.exports = router

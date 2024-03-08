const router = require('express').Router()

const bcrypt = require('bcrypt');
const { User } = require('../../../../db/models')
const upload = require('../../../../multer')

router.post('/avatarUpd', upload.single('avatar'), async (req, res) => {

})

router.put('/userUpd', async (req, res) => {
  try {
    const user = req.body
    const reqUser = await User.findByPk(user.id)
    if (user.email === req.body.email) {
      await reqUser.update(req.body)
      delete reqUser.password
      res.status(201).json(reqUser);
    } else if (User.findOne({ where: { email: user.email } })) {
      res.status(500).json({ err: 'Что-то пошло не так в ручке' });
    } else {
      await reqUser.update(req.body)
      delete reqUser.password
      res.status(201).json(reqUser);
    }
  } catch (error) {
    res.status(500).json({ err: 'Что-то пошло не так в ручке' });
  }
})

//! ручка с адресом на холде

// router.put('/addressUpd', async (req, res) => {

// })

router.put('/passUpd', async (req, res) => {
  try {
    const { oldPassword, newPassword, repitePassword } = req.body
    const { user } = req.session
    if (newPassword === repitePassword) {
      const reqUser = await User.findByPk(user.id)
      if (await bcrypt.compare(oldPassword, reqUser.password)) {
        const newPassHash = await bcrypt.hash(newPassword, 10);
        await reqUser.update({ password: newPassHash })
        const finUser = reqUser.get({ plain: true })
        delete finUser.password
        res.status(201).json(finUser);
      } else {
        res.status(500).json({ err: 'Старый пароль неверен' })
      }
    } else {
      res.status(500).json({ err: 'Пароли не совпадают' })
    }
  } catch (error) {
    res.status(500).json({ err: error })
  }
})

module.exports = router

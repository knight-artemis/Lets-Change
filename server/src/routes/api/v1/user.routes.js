const router = require('express').Router()
const bcrypt = require('bcrypt')
const generator = require('generate-password')

const { User, Deal, Thing } = require('../../../../db/models')
const upload = require('../../../../multerForAvatars')

const mailer = require('../../../../nodeMailer')

router.post('/avatarUpd', upload.single('avatar'), async (req, res) => {
  try {
    const reqUser = await User.findByPk(req.session.user.id)
    await reqUser.update({ avatarUrl: req.file.filename })
    const finUser = reqUser.get({ plain: true })
    res.status(200).json(finUser)
  } catch (error) {
    res.status(500).json({ err: 'Что-то пошло не так в ручке' })
  }
})

router.get('/deleteAvatar', async (req, res) => {
  try {
    const reqUser = await User.findByPk(req.session.user.id)
    await reqUser.update({ avatarUrl: '' })
    const finUser = reqUser.get({ plain: true })
    res.status(200).json(finUser)
  } catch (error) {
    res.status(500).json({ err: 'Что-то пошло не так в ручке' })
  }
})

router.post('/resetpass', async (req, res) => {
  try {
    const { email } = req.body
    const reqUser = await User.findOne({ where: { email } })
    if (reqUser) {
      const newPassword = generator.generate({
        length: 8,
        numbers: true,
      })
      const hash = await bcrypt.hash(newPassword, 10)
      await reqUser.update({ password: hash })
      const message = {
        to: email,
        subject: 'Временный пароль от профиля "Давай меняться"',
        text: `
        
        Добрый день!
  
        Ваш временный пароль от профиля на портале "Давай меняться": ${newPassword}
        
        После восстановления доступа просим Вас как можно скорее сменить временный пароль на постоянный.
        
        С уважением,
        администрация проекта "Давай меняться".
  
        `,
      }
      mailer(message)
      res.status(200).json({ msg: 'Сброс пароля был успешно запрошен' })
    } else {
      res.status(500).json({ err: 'Пользователя с таким почтовым адресом не существует' })
    }
  } catch (error) {
    res.status(500).json({ err: error })
  }
})

router.put('/userUpd', async (req, res) => {
  try {
    const user = req.body
    const reqUser = await User.findByPk(user.id)
    if (user.email === req.body.email) {
      await reqUser.update(req.body)
      delete reqUser.password
      res.status(200).json(reqUser)
    } else if (User.findOne({ where: { email: user.email } })) {
      res.status(500).json({ err: 'Что-то пошло не так в ручке' })
    } else {
      await reqUser.update(req.body)
      delete reqUser.password
      res.status(200).json(reqUser)
    }
  } catch (error) {
    res.status(500).json({ err: 'Что-то пошло не так в ручке' })
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
        const newPassHash = await bcrypt.hash(newPassword, 10)
        await reqUser.update({ password: newPassHash })
        const finUser = reqUser.get({ plain: true })
        delete finUser.password
        res.status(200).json(finUser)
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

router.get('/notifications', async (req, res) => {
  // console.log('USERID+++++++>', req.session.user?.id)
  try {
    const { id } = req.session.user
    const initiator = await Deal.findAll({
      where: { initiatorId: id, initiatorNote: true },
    })
    const reciever = await Deal.findAll({
      where: { recieverNote: true },
      include: {
        model: Thing,
        where: { userId: id },
      },
    })
    res.json({ initiator: initiator.length, reciever: reciever.length })
  } catch (error) {
    console.error('Ошибка при получении уведомлений', error)
    res.status(500).send({ err: { server: 'Ошибка сервера при получении уведомлений' } })
  }
})

module.exports = router

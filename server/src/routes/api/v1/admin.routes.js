const router = require('express').Router()
const bcrypt = require('bcrypt')
// const { checkUser, secureRoute } = require('../../../../miiddleWares/common');

const { Admin } = require('../../../../db/models')

router.get('/checkAdminSession', async (req, res) => {
  console.log('POPAL', req.session)
  const { admin } = req.session
  if (admin) res.json(req.session.admin)
  else res.json({ id: 0, login: '' })
})

router.post('/log', async (req, res) => {
  try {
    const { login, password } = req.body
    const rawAdmin = await Admin.findOne({ where: { login } })
    if (!rawAdmin) {
      res.status(401).json({ err: { login: 'не верный логин' } })
    } else {
      const admin = rawAdmin.get({ plain: true })
      const checkPass = await bcrypt.compare(password, admin.password)
      if (checkPass) {
        req.session.admin = { ...admin }
        delete admin.password
        if (req.session.user) {
          req.session.regenerate(() => {
            req.session.admin = { ...admin }
            res.json(admin)
          })
        } else {
          req.session.save(() => {
            console.log(req.session)
            res.json(admin)
          })
        }
      } else {
        res.status(401).json({ err: { pass: 'не верный пароль' } })
      }
    }
  } catch (error) {
    res.status(500).json({ err: { server: 'ошибка сервера' } })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('Cookie')
    res.sendStatus(200)
  })
})

module.exports = router

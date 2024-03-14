const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Thing, Issue } = require('../../../../db/models')
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
      console.log("🚀 ~ router.post ~ password:", password)
      console.log("🚀 ~ router.post ~ password:", await bcrypt.hash(password, 10))
      console.log("🚀 ~ router.post ~ admin.password:", admin.password)
      console.log("🚀 ~ router.post ~ checkPass:", checkPass)
      if (checkPass) {
        console.log('я зашёл пасворд')
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

router.patch('/accept/:id', async (req, res) => {
  const { id } = req.params
  try {
    const thing = await Thing.findByPk(id)
    const issue = await Issue.findOne({
      where: {
        thingId: id,
      },
    })
    if (issue) issue.destroy()
    await thing.update({ isApproved: true })
    res.json(thing)
  } catch (error) {
    res.status(500).json({ err: { server: 'ошибка сервера' } })
  }
})

router.post('/reject/:id', async (req, res) => {
  const { id } = req.params
  const { oldIssue, issue } = req.body
  try {
    // const newIssue = Issue.upsert({
    //   issue,
    //   thingId: id,
    //   badGuyId: 1,
    //   victimId: 1,
    // })
    if (oldIssue) {
      const iss = await Issue.findOne({ where: { issue: oldIssue } })
      await iss.update({ issue })
      console.log(iss, issue, oldIssue)
      res.json(iss)
    } else {
      const newIssue = await Issue.create({
        issue,
        thingId: id,
        badGuyId: 1,
        victimId: 1,
      })
      res.json(newIssue)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('Cookie')
    res.sendStatus(200)
  })
})

module.exports = router

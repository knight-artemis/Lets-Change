const router = require('express').Router();
const bcrypt = require('bcrypt');
const { checkUser, secureRoute } = require('../../../../miiddleWares/common');

const { User } = require('../../../../db/models');

router.get('/checkSession', async (req, res) => {
  const { user } = req.session;
  if (user) res.json(req.session.user);
  else res.json({ id: 0, firstName: '', email: '' });
});

router.post('/reg', secureRoute, async (req, res) => {
  try {
    const { firstName, email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json({ err: 'Пользователь с таким email уже существует' });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        firstName,
        email,
        password: hash,
      }).then((resp) => resp.get({ plain: true }));
      delete newUser.password;
      req.session.user = { ...newUser };
      req.session.save(() => {
        res.status(201).json(newUser);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: { server: 'ошибка сервера' } });
  }
});

router.post('/log', secureRoute, async (req, res) => {
  try {
    const { email, password } = req.body;
    const rawUser = await User.findOne({ where: { email } });
    if (!rawUser) {
      res.status(401).json({ err: { email: 'не верный e-mail' } });
    } else {
      const user = rawUser.get({ plain: true });
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        delete user.password;
        req.session.user = { ...user };
        req.session.save(() => {
          res.status(200).json(user);
        });
      } else {
        res.status(401).json({ err: { pass: 'не верный пароль' } });
      }
    }
  } catch (error) {
    res.status(500).json({ err: { server: 'ошибка сервера' } });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('Cookie');
    res.sendStatus(200);
  });
});

router.post('/checkmail', secureRoute, async (req, res) => {
  try {
    const { email } = req.body
    console.log('🚀 ~ router.post ~ email:', email)
    const reqEmail = await User.findOne({ where: { email } })
    console.log('🚀 ~ router.post ~ reqEmail:', reqEmail)
    if (reqEmail) {
      res.json(true)
    } else {
      res.json(false)
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: { server: 'ошибка сервера' } });
  }
});

router.post('/checkPass', secureRoute, async (req, res) => {
  try {
    const { email, password } = req.body
    const reqUser = await User.findOne({ where: { email } })
    if (reqUser) {
      const user = reqUser.get({ plain: true });
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        res.json(true)
      } else {
        res.json(false)
      }
    } else {
      res.json('False')
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: { server: 'ошибка сервера' } });
  }
});

module.exports = router;

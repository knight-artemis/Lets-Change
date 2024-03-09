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
    const errors = {};
    if (!firstName) errors.firstName = 'Пожалуйста, введите Ваше имя.'
    if (!email) errors.email = 'Пожалуйста, введите Ваш email.';
    if (!password) errors.password = 'Пожалуйста, придумайте пароль.';
    if (errors.login || errors.email || errors.password) {
      res.json({ err: errors });
    } else {
      const user = await User.findOne({ where: { email } });
      if (user) {
        errors.email = 'Пользователь с таким email уже существует';
        res.json({ err: errors });
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

module.exports = router;

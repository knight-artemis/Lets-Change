function secureRoute(req, res, next) {
  if (!req.session.userId) {
    next();
  } else {
    res.sendStatus(403);
  }
}

function checkUser(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = { secureRoute, checkUser };

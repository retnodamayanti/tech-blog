const withAuth = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/auth/signin');
  } else {
    next();
  }
};

module.exports = withAuth;

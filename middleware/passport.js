const mustAuthenticated = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

module.exports = {
  mustAuthenticated
};
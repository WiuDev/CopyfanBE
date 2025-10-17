function isAdmin(req, res, next) {
  const user = req.user;

  if (user && user.role.toUpperCase() === "ADMIN") {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}

module.exports = isAdmin;
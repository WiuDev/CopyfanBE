function isTeacher(req, res, next) {
  const user = req.user;

  if (user && user.role.toUpperCase() === "TEACHER") {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
}

module.exports = isTeacher;
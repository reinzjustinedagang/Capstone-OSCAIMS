function getUserIp(req, res, next) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.connection.remoteAddress || req.ip;
  req.userIp = ip;
  next();
}

module.exports = getUserIp;

const verifyRole = (role) => {
  return (req, res, next) => {
    if (!req.role) return res.sendStatus(401);
    console.log(role, req.role);
    const isVerfy = role === req.role;
    if (!isVerfy) return res.sendStatus(403);
    next();
  };
};

module.exports = verifyRole;

const User = require("../model/user");

const handleLogOut = async (req, res) => {
  const cookies = req.cookies;

  const refreshToken = cookies?.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.sendStatus(204);
};

module.exports = handleLogOut

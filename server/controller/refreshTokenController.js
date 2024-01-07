const User = require("../model/user");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies?.jwt;

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.RERESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return;

        const hackedUser = await User.findOne({
          userName: decoded.userName,
        }).exec();

        hackedUser.refreshToken = [];
        hackedUser.save();
      }
    );

    return res.sendStatus(403);
  }

  let newRefreshTokenArr = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(
    refreshToken,
    process.env.RERESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArr];
        foundUser.save();
      }

      if (err || foundUser.userName !== decoded.userName) {
        return res.sendStatus(403);
      }
      let roles = Object.entries(foundUser.role).find((role) => {
        return role[1] !== false;
      });
      const role = roles[0];

      const AccessToken = jwt.sign(
        { userInfo: { userName: foundUser.userName, role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      const newRefreshToken = jwt.sign(
        { userName: foundUser.userName },
        process.env.RERESH_TOKEN_SECRET,
        { expiresIn: "2d" }
      );

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });

      foundUser.refreshToken = [...newRefreshTokenArr, newRefreshToken]
      foundUser.save()
      res.json({role, AccessToken})
    }
  );
};

module.exports = handleRefreshToken

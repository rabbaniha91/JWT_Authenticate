const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleAuth = async (req, res) => {
  const cookies = req.cookies;
  try {
    const { userName, password } = req.body;
    if (!userName || !password)
      return res
        .status(400)
        .json({ message: "نام کاربری یا رمز عبور نمی تواند خالی باشد." });
    const foundUser = await User.findOne({ userName }).exec();
    if (!foundUser) return res.sendStatus(404);
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401);
    
   let roles = Object.entries(foundUser.role).find(role => {
    return role[1] !== false
   });
   const role = roles[0]
   

    const AccessToken = jwt.sign(
      { userInfo: { userName: foundUser.userName, role }},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const newRefreshToken = jwt.sign(
      { userName: foundUser.userName },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    let newRefreshTokenArr = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies?.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies?.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      if (!foundToken) {
        newRefreshTokenArr = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    foundUser.refreshToken = [...newRefreshTokenArr, ...newRefreshToken];
    await foundUser.save();
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 2,
    });
    res.json({role ,AccessToken})
  } catch (error) {
    res.status(500).json({message: error?.message})
  }
};
module.exports = {handleAuth}

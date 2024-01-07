const User = require("../model/user");
const bCrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if ((!userName, !password))
      return res
        .status(400)
        .json({ message: "نام کاربری و رمز عبور نمی تواند خالی باشد." });
    const duplicate = await User.findOne({ userName });
    if (duplicate) return res.status(409).json({message: "نام کاربری قبلا استفاده شده است."});

    const hashedPassword = await bCrypt.hash(password, 15)

    await User.create({
        userName,
        password: hashedPassword
    })

    res.status(201).json({message: "حساب کاربری با موفقیت ایجاد شد."})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

module.exports = {
    register
}

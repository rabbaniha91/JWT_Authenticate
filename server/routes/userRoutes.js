const express = require("express")
const {register} = require("../controller/userController")
const {handleAuth} = require("../controller/authController")
const handleLogOut = require("../controller/logOutController")

const router = express.Router()

router.post("/login", handleAuth)
router.post("/register", register)
router.get("/logout", handleLogOut)

module.exports = router

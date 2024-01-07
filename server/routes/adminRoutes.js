const express = require("express");
const verifyRole = require("../middlewares/verifyRole");
const getAllUsers = require("../controller/usersController");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

const role = "Admin";

router.use(verifyJWT)
router.get("/getUsers", verifyRole(role), getAllUsers);

module.exports = router;

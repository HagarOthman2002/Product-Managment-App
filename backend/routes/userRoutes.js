const express = require("express");
const { authenticateToken } = require("../utilities");
const router = express.Router();
const userController = require("./../controller/userController")

router.route("/register").post(userController.createAccount);
router.route("/login").post(userController.login);
router.route("/user").get(authenticateToken, userController.getUser);

module.exports = router;

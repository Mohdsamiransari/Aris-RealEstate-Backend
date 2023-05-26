const express = require("express");
const router = express.Router();
const {
  registerUser,
  UserLogin,
  UserLogout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateUserProfile,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/newUser").post(registerUser);
router.route("/Userlogin").post(UserLogin);
router.route("/reset").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);

router.route("/Userlogout").get(UserLogout);

router.route("/userProfile").post(isAuthenticatedUser, getUserProfile);
router.route("/update/userProfile").put(isAuthenticatedUser, updateUserProfile);

router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);

module.exports = router;

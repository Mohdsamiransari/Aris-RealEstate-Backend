const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
  //   folder: "avatars",
  //   width: 150,
  //   crop: "scale"
  // })

  const user = await User.create(req.body);

  sendToken(user, 200, res);
});

// Login User

exports.UserLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "Email or Password does not match",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User does not exists",
    });
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Password does not match",
    });
  }

  sendToken(user, 200, res);
});

//forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset password url
  const resetUrl = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nif you have not requested this email, then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Aris Passowrd Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `A reset link has been set to your email.`,
    });
  } catch {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// resetpassword
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("password reset token is invalid or has expired", 404)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 404));
  }

  user.password = req.body.password;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// user profile

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    user,
  });
});

//Update or change passowrd

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check prev user's password
  const isMatched = await user.comparePassword(req.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorHandler("old password is incorrect"), 400);
  }
  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed",
  });
});

//Update users profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // update avatar
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// logout user

exports.UserLogout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Loged out",
  });
};

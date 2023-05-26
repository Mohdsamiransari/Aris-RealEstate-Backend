const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // const { token } = req.cookies;
 
  const {cookie} = req.headers
  const token = cookie.split("token=")[1].split(";")[0]
  if (!token) {
    return next(new ErrorHandler("Login first to access resourse"), 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);
  next();
});

//Handling Role
exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

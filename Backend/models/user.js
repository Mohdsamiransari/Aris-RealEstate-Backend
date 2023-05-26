const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const buyerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validator: [validator.isEmail, "Please enter correct Email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "Password cannot be less than 8 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//Encrypting password
buyerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// compare password

buyerSchema.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Return JWT token

buyerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPRIES_TIME,
  });
};

// Generate password reset token
buyerSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash and set ot resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("Buyer", buyerSchema);

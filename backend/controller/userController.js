const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createAccount = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res.status(400).json({
      error: true,
      message: "Full Name is required",
    });
  }

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: true,
      message: "Password is required",
    });
  }
  const isUSer = await User.findOne({ email: email });
  if (isUSer) {
    return res.json({
      error: true,
      message: "user already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });
  await user.save();

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3600m",
    }
  );
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registarion successful",
  });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials",
    });
  }

  const payload = { id: userInfo._id };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  });

  return res.json({
    error: false,
    message: "Login successful",
    email,
    accessToken,
  });
};


exports.getUser = async (req, res) => {
  const user = req.user;
  const isUser = await User.findOne({ _id: user.id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser.id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
};
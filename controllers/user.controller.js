const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/fogot-password.model");
const generateHelper = require("../helpers/generate");
const sendMailHelper = require("../helpers/sendEmail");

module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu thông tin email hoặc mật khẩu"
      });
    }

    const existsEmail = await User.findOne({
      email,
      deleted: false
    });

    if (existsEmail) {
      return res.status(400).json({
        code: 400,
        message: "Email đã tồn tại"
      });
    }

    const token = generateHelper.generateRandomString(32);
    const user = new User({
      fullName,
      email,
      password: md5(password),
      token
    });

    await user.save();

    res.cookie("token", token);
    return res.status(200).json({
      code: 200,
      message: "Tạo tài khoản thành công",
      token
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại"
      });
    }

    if (md5(password) !== user.password) {
      return res.status(400).json({
        code: 400,
        message: "Sai mật khẩu"
      });
    }

    res.cookie("token", user.token);
    return res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      token: user.token
    });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại"
      });
    }

    const otp = generateHelper.generateRandomNumber(8);
    const timeExpire = 5;

    await ForgotPassword.deleteMany({ email });

    const forgotPassword = new ForgotPassword({
      email,
      otp,
      expireAt: new Date(Date.now() + timeExpire * 60 * 1000)
    });

    await forgotPassword.save();

    const subject = "Mã OTP đặt lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <strong>${otp}</strong></p>`;

    await sendMailHelper.sendEmail(email, subject, html);

    return res.status(200).json({
      code: 200,
      message: "Đã gửi mã OTP qua email"
    });
  } catch (error) {
    console.error("Password reset request failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports.otpPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await ForgotPassword.findOne({
      email,
      otp,
      expireAt: { $gt: new Date() }
    });

    if (!result) {
      return res.status(400).json({
        code: 400,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn"
      });
    }

    const user = await User.findOne({
      email,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Email không tồn tại"
      });
    }

    res.cookie("token", user.token);

    return res.status(200).json({
      code: 200,
      message: "Xác thực thành công",
      token: user.token
    });
  } catch (error) {
    console.error("Password reset OTP verification failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu token hoặc mật khẩu mới"
      });
    }

    const user = await User.findOne({
      token,
      deleted: false
    });

    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Token không hợp lệ"
      });
    }

    if (md5(password) === user.password) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
      });
    }

    const newToken = generateHelper.generateRandomString(32);
    user.password = md5(password);
    user.token = newToken;
    await user.save();

    res.cookie("token", newToken);

    return res.status(200).json({
      code: 200,
      message: "Đổi mật khẩu thành công",
      token: newToken
    });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports.detail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: "Bạn chưa đăng nhập"
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Lấy thông tin thành công",
      info: req.user
    });
  } catch (error) {
    console.error("User detail lookup failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};


module.exports.list = async (req, res) => {
  try {
    const users = await User.find({
      deleted: false
    }).select("fullName email");

    return res.status(200).json({
      code: 200,
      message: "Thành công",
      data: users
    });
  } catch (error) {
    console.error("User list lookup failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};
const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const authorization = req.get("Authorization");
  const bearerToken = authorization && /^Bearer\s+(.+)$/i.exec(authorization);
  const token = (bearerToken && bearerToken[1]) || req.cookies.token;

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Vui lòng đăng nhập"
    });
  }

  try {
    const user = await User.findOne({
      token,
      deleted: false
    }).select("-password -token");

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Tài khoản không hợp lệ"
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Authentication lookup failed:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi hệ thống"
    });
  }
};
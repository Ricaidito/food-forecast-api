const authConfig = {
  tokenExpireTime: "1h",
  secretKey: process.env.JWT_SECRET,
};

module.exports = authConfig;

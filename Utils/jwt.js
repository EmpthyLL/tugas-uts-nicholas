const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

function generateAccToken(data) {
  return jwt.sign(data, ACCESS_KEY, {
    expiresIn: "15m",
  });
}
function generateRefToken(data) {
  return jwt.sign(data, REFRESH_KEY, {
    expiresIn: "7d",
  });
}
function decryptAccToken(token) {
  return jwt.verify(token, ACCESS_KEY);
}
function decryptRefToken(token) {
  return jwt.verify(token, REFRESH_KEY);
}

async function handleTokenRefresh(user) {
  decryptRefToken(user.refresh_token);

  const acc_token = generateAccToken({ uuid: user.uuid });

  return acc_token;
}

module.exports = {
  generateAccToken,
  generateRefToken,
  decryptAccToken,
  decryptRefToken,
  handleTokenRefresh,
};

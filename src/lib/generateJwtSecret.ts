import crypto from "crypto";

// 生成一个随机的JWT密钥
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString("hex");
};

// 输出生成的密钥
console.log(generateJWTSecret());

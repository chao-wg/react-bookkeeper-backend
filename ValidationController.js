import express from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 创建一个SMTP客户端配置
const config = {
  service: "QQ",
  auth: {
    // 发件人邮箱账号
    user: 'no-reply73@qq.com',
    //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
    pass: 'scitxyzelaveiiaf'
  }
}
// 创建一个邮件发送器
const transporter = nodemailer.createTransport(config);

// 发送验证码
const sendValidationCode = (email) => {
  // 生成6位随机验证码
  const validationCode = Math.floor(100000 + Math.random() * 900000);

  // 设置邮件选项
  const mailOptions = {
    from: 'no-reply73@qq.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${validationCode}`
  };

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// TODO
// validateEmailAndCode() 函数用于验证邮箱和验证码
function validateEmailAndCode(email, code) {
  // 验证逻辑
  return true;
}

// POST 请求处理程序
router.post('/', (req, res) => {
  const {email, code} = req.body;
  //发送邮件
  sendValidationCode(email);
  // 进行邮箱和验证码的验证，假设验证函数为 validateEmailAndCode()
  if (validateEmailAndCode(email, code)) {
    // 验证通过，生成 JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    // 将 JWT 返回给客户端
    res.json({ token });
  } else {
    // 验证未通过
    res.status(401).json({ error: 'Invalid email or code' });
  }
});


export default router;

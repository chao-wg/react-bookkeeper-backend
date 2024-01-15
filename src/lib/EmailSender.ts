import nodemailer from "nodemailer";

type MailConfig = {
  to: string;
  subject: string;
}

// Create an SMTP client configuration
const config = {
  service: "QQ",
  auth: {
    // sender email address
    user: 'no-reply73@qq.com',
    // Authorization code for sender email address
    pass: 'scitxyzelaveiiaf'
  }
}
// Create a mail sender
const transporter = nodemailer.createTransport(config);

// send validation code
export function sendValidationCode(mailConfig: MailConfig) {
  const {to, subject} = mailConfig;
  // Generate a 6-digit random verification code
  const validationCode = Math.floor(100000 + Math.random() * 900000);

  // Set mail options
  const mailOptions = {
    from: config.auth.user,
    to,
    subject,
    text: `Your verification code is: ${validationCode}`
  };

  // Send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return validationCode.toString();
}

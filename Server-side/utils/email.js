const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //   // transport by Gmail ==> only 500 email per day  & you will be marked as a spammer
  //   const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //       user: process.env.USERNAME_GMAIL,
  //       pass: process.env.PASSWORD_GMAIL,
  //     },
  //     //activate in gmail "less secure app" option
  //   });

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Mahmoud Yahia <admin@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

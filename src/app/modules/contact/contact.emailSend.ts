import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (data: any, mail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"Support" ${mail}>`,
    to: `${config.emailSender.support_mail_address}`,
    subject: `${data.subject}`,
    html,
    replyTo: mail,
  });
  return info.messageId;
};

export const contactEmailSender = {
  emailSender,
};

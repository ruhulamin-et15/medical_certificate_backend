import nodemailer from "nodemailer";
import config from "../../../config";

interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType: string;
}

const emailSender = async (
  subject: string,
  email: string,
  html: any,
  attachments?: Attachment[]
) => {
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

  await transporter.sendMail({
    from: '"Medic Team" <medicteam@gmail.com>',
    to: email,
    subject: `${subject}`,
    html,
    attachments: attachments || [],
  });
};

export default emailSender;

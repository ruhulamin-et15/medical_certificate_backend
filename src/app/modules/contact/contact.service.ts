import { contactEmailSender } from "./contact.emailSend";

const sendEmailSupport = async (bodyData: {
  name: string;
  email: string;
  message: string;
}) => {
  const htmlData = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; border: 1px solid #e0e0e0;">
        <tr>
          <td style="background-color: #0073e6; padding: 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px;">Support Request</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <h2 style="color: #0073e6; font-size: 20px;">Hello, Support Team!</h2>
            <p>You've received a new support request from <strong>${
              bodyData.name
            }</strong> (${bodyData.email}).</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0;" />
            <h3 style="color: #0073e6; font-size: 18px;">Message:</h3>
            <p style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0073e6; font-style: italic;">
              ${bodyData.message}
            </p>
            <p style="margin-top: 20px; font-size: 14px; color: #888;">
              Thank you for attending to this request promptly!
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Medic Team. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>`;

  const result = await contactEmailSender.emailSender(
    bodyData,
    bodyData.email,
    htmlData
  );

  return result;
};

export const contactService = {
  sendEmailSupport,
};

export const htmlInfo = (
  firstName: string,
  lastName: string,
  requestStatus: string,
  referenceNumber?: string
) => {
  if (requestStatus === "APPROVED") {
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
    <table width="100%" style="border-collapse: collapse;">
      <tr>
        <td style="background-color: #007BFF; color: #ffffff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Certificate Status Update</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #ffffff; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin: 0;">Dear <strong>${firstName}</strong>,</p>
          <p style="font-size: 16px; margin-top: 10px;">Your sick note request status has been updated to: <strong>${requestStatus}</strong>.</p>
          
            <p style="font-size: 16px; margin-top: 18px;">Your sick note request Details:</p>
           <strong>First Name: ${firstName}</strong><br/>
           <strong>Last Name: ${lastName}</strong><br/>
           <strong>Reference Number: ${referenceNumber}</strong><br/>
           <a href="https://mediconline.uk/medical-letter-verification">Verify your certificate from here</a><br/>
          
          <p style="font-size: 16px; margin-top: 10px;">Please ignore this email or contact support if you have any concerns.</p>
          <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>Medic Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Medic Team. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>`;
  } else {
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
    <table width="100%" style="border-collapse: collapse;">
      <tr>
        <td style="background-color: #007BFF; color: #ffffff; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Certificate Status Update</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #ffffff; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin: 0;">Dear <strong>${firstName}</strong>,</p>
          <p style="font-size: 16px; margin-top: 10px;">Your sick note request status has been updated to: <strong>${requestStatus}</strong>.</p>
          <p style="font-size: 16px; margin-top: 10px;">Please ignore this email or contact support if you have any concerns.</p>
          <p style="font-size: 16px; margin-top: 20px;">Thank you,<br>Medic Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #888; border-radius: 0 0 10px 10px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Medic Team. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>`;
  }
};

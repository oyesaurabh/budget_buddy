import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface LoginDetails {
  browser: string;
  os: string;
  device: string;
  location: string;
  ip: string;
  time: string;
}

export const getLoginSuccessTemplate = (username: string, details: LoginDetails): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: #000000; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; line-height: 1.6; }
        .welcome { font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #edf2f7; padding-bottom: 8px; }
        .info-row:last-child { border: 0; margin-bottom: 0; padding-bottom: 0; }
        .label { color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 700; }
        .value { color: #1e293b; font-size: 14px; font-weight: 500; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Budget Buddy</h1>
        </div>
        <div class="content">
          <p class="welcome">New login detected, ${username}!</p>
          <p>Your account was just accessed. If this was you, you can safely ignore this email.</p>
          
          <div class="info-card">
            <div class="info-row">
              <span class="label">Device/OS </span>
              <span class="value">${details.device} (${details.os})</span>
            </div>
            <div class="info-row">
              <span class="label">Browser </span>
              <span class="value">${details.browser}</span>
            </div>
            <div class="info-row">
              <span class="label">Location </span>
              <span class="value">${details.location}</span>
            </div>
            <div class="info-row">
              <span class="label">IP Address </span>
              <span class="value">${details.ip}</span>
            </div>
            <div class="info-row">
              <span class="label">Time </span>
              <span class="value">${details.time}</span>
            </div>
          </div>

          <p>Wasn't you? Secure your account immediately by changing your password.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/authenticate" class="btn">Secure Account</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Budget Buddy. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendLoginNotification = async (
  email: string,
  username: string,
  details: LoginDetails
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"Budget Buddy Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Security Alert: New Login to Budget Buddy",
      html: getLoginSuccessTemplate(username, details),
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending login email:", error);
    return false;
  }
};

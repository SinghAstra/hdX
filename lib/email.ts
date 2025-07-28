import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otpCode: string) {
  try {
    console.log(`📧 Sending OTP email to: ${email} with code: ${otpCode}`);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Verification Code - Notes App</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Notes App</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          
          <!-- Main Content -->
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 24px;">Your Verification Code</h2>
            <p style="margin-bottom: 30px; font-size: 16px; text-align: center; color: #666;">
              Enter this code on the Notes App sign-in page to complete your verification:
            </p>
            
            <!-- OTP Code Display -->
            <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%); border: 3px solid #667eea; border-radius: 16px; padding: 40px; text-align: center; margin: 30px 0; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Verification Code</p>
              <div style="font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 10px 0;">
                ${otpCode}
              </div>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #999;">This code expires in 10 minutes</p>
            </div>
            
            <!-- Instructions -->
            <div style="background: #e8f5e8; border-left: 4px solid #4caf50; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 How to use this code:</h3>
              <ol style="color: #2e7d32; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.6;">
                <li>Return to the Notes App sign-in page</li>
                <li>Enter this 6-digit code in the verification field</li>
                <li>Click "Verify and sign in" to complete the process</li>
              </ol>
            </div>
            
            <!-- Security Notice -->
            <div style="border-top: 2px solid #f0f0f0; padding-top: 25px; margin-top: 30px;">
              <h4 style="color: #d32f2f; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">🔒 Security Notice:</h4>
              <ul style="color: #666; padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.6;">
                <li>This code will expire in 10 minutes for your security</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this code, please ignore this email</li>
              </ul>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 2px solid #f0f0f0;">
              <p style="font-size: 13px; color: #999; margin: 0;">
                This email was sent from Notes App.<br>
                If you have questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Notes App - Verification Code
      
      Your verification code is: ${otpCode}
      
      How to use this code:
      1. Return to the Notes App sign-in page
      2. Enter this 6-digit code in the verification field
      3. Click "Verify and sign in" to complete the process
      
      This code expires in 10 minutes.
      
      Security Notice:
      - Never share this code with anyone
      - If you didn't request this code, please ignore this email
      
      Best regards,
      The Notes App Team
    `;

    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `${otpCode} - Your Notes App verification code`,
      text,
      html,
    });

    console.log("✅ OTP email sent successfully:", result.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✅ Email server configuration is valid");
    return true;
  } catch (error) {
    console.error("❌ Email server configuration error:", error);
    return false;
  }
}

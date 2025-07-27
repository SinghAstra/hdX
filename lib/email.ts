import { siteConfig } from "@/config/site";
import { createTransport } from "nodemailer";

const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
if (!EMAIL_SERVER_PORT) {
  throw new Error("Email Server Port is required");
}

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: { server: any; from: string };
}) {
  try {
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get("token");
    console.log("email is ", email);
    console.log("url is ", url);
    console.log("urlObj.searchParams is ", urlObj.searchParams);
    console.log("token is ", token);

    const otpCode = token ? token.slice(-6).toUpperCase() : "VERIFY";
    console.log("otpCode is ", otpCode);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Notes App</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Notes App</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Secure Email Verification</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
            <p style="margin-bottom: 30px; font-size: 16px;">
              Hello! We received a request to sign in to your ${siteConfig.name} account using this email address.
            </p>
            
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                ${otpCode}
              </div>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">This code expires in 24 hours</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block; 
                        transition: transform 0.2s;">
                Verify Email Address
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
                <strong>Security Notice:</strong>
              </p>
              <ul style="font-size: 14px; color: #666; padding-left: 20px;">
                <li>This verification link will expire in 24 hours</li>
                <li>If you didn't request this, please ignore this email</li>
                <li>Never share this code with anyone</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #999;">
                This email was sent from Notes App. If you have questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      ${siteConfig.name} - Email Verification
      
      Hello! We received a request to sign in to your ${siteConfig.name} account.
      
      Your verification code is: ${otpCode}
      
      Or click this link to verify: ${url}
      
      This link expires in 24 hours.
      
      If you didn't request this, please ignore this email.
      
      Best regards,
      The ${siteConfig.name} Team
    `;

    // Send the email using the configured transporter
    const result = await transporter.sendMail({
      from: provider.from,
      to: email,
      subject: `${otpCode} - Your ${siteConfig.name} verification code`,
      text,
      html,
    });

    console.log("✅ Verification email sent successfully:", result.messageId);
  } catch (error) {
    console.log("❌ Failed to send verification email");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    throw new Error("Failed to send verification email");
  }
}

export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✅ Email server configuration is valid");
    return true;
  } catch (error) {
    console.error("❌ Email server configuration error.");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return false;
  }
}

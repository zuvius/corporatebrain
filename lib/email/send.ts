interface MagicLinkEmailParams {
  to: string;
  code: string;
  tenantSlug: string;
}

export async function sendMagicLinkEmail({ to, code, tenantSlug }: MagicLinkEmailParams) {
  // For development, log to console
  // In production, integrate with SendGrid, Resend, or AWS SES
  
  console.log("=".repeat(50));
  console.log("MAGIC LINK EMAIL");
  console.log("=".repeat(50));
  console.log(`To: ${to}`);
  console.log(`Tenant: ${tenantSlug}`);
  console.log("");
  console.log("Your verification code is:");
  console.log("┌─────────────┐");
  console.log(`│   ${code}    │`);
  console.log("└─────────────┘");
  console.log("");
  console.log("This code will expire in 15 minutes.");
  console.log("=".repeat(50));
  
  // TODO: Integrate with email provider
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "Corporate Brain <noreply@corporatebrain.com>",
  //   to,
  //   subject: `Your Corporate Brain verification code: ${code}`,
  //   html: generateMagicLinkEmailHTML(code),
  // });
  
  return { success: true };
}

export function generateMagicLinkEmailHTML(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .code { 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 4px;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Your Corporate Brain Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div class="code">${code}</div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>- The Corporate Brain Security Team</p>
        </div>
      </body>
    </html>
  `;
}

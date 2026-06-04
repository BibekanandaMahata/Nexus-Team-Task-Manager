import nodemailer from 'nodemailer';

// ─── Create a reusable transporter ─────────────────────────────────────────

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP env vars: SMTP_HOST, SMTP_USER, SMTP_PASS are required.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = createTransporter();
  }
  return _transporter;
}

// ─── Send the OTP email ─────────────────────────────────────────────────────

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Nexus" <${from}>`,
    to: email,
    subject: `Your Nexus login code: ${code}`,
    text: `Your one-time login code is: ${code}\n\nThis code expires in 10 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0b0f19; color: #f8fafc; border-radius: 12px; border: 1px solid #1e293b;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Nexus</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">Your login code</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">Use the code below to sign in. It expires in <strong style="color: #f8fafc;">10 minutes</strong>.</p>
        <div style="background: #111827; border: 1px solid #1e293b; border-radius: 8px; padding: 24px; text-align: center; letter-spacing: 8px; font-size: 36px; font-weight: 700; color: #3b82f6; margin-bottom: 24px;">
          ${code}
        </div>
        <p style="color: #475569; font-size: 12px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  });
}

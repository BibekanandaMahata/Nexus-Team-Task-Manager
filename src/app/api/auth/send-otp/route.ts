import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase/server';
import { sendOtpEmail } from '@/lib/email/mailer';

const schema = z.object({
  email: z.email({ error: 'Please enter a valid email address.' }),
});

// ─── POST /api/auth/send-otp ───────────────────────────────────────────────
// Generates a 6-digit OTP, stores it with a 10-min TTL, and emails it.

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // +10 min

  const db = getSupabase();

  // Invalidate any existing unused OTPs for this email
  await db.from('otps').update({ used: true }).eq('email', email).eq('used', false);

  // Insert the new OTP
  const { error: insertError } = await db.from('otps').insert({
    email,
    code,
    expires_at: expiresAt,
  });

  if (insertError) {
    console.error('[send-otp] DB insert error:', insertError);
    return Response.json({ error: 'Failed to generate OTP. Try again.' }, { status: 500 });
  }

  // Send the email
  try {
    await sendOtpEmail(email, code);
  } catch (emailError) {
    console.error('[send-otp] Email send error:', emailError);
    return Response.json({ error: 'Failed to send OTP email. Check SMTP configuration.' }, { status: 500 });
  }

  return Response.json({ message: 'OTP sent. Check your email.' }, { status: 200 });
}

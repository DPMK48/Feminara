import twilio from 'twilio';

type SmsResult = { ok: true } | { ok: false; error?: string };

type SmsPayload = {
  to: string;
  body: string;
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms({ to, body }: SmsPayload): Promise<SmsResult> {
  if (!client || !fromNumber) {
    return { ok: false, error: 'Twilio not configured' };
  }

  try {
    await client.messages.create({
      to,
      from: fromNumber,
      body,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Failed to send SMS' };
  }
}

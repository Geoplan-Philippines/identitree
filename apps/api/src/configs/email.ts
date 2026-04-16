import { Resend } from 'resend';
import { env } from './env';

type SendAuthEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export async function sendAuthEmail({
  to,
  subject,
  text,
  html,
}: SendAuthEmailInput) {
  if (!resend) {
    console.error('RESEND_API_KEY is not set');
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    const response = await resend.emails.send({
      from: env.resendFromEmail,
      to,
      subject,
      text,
      html,
    });

    // Resend may return { data: null, error: {...} } without throwing.
    // Treat that as a failed send so auth flow can surface a real error.
    if (response.error) {
      console.error(`Resend rejected email to ${to}:`, response.error);
      throw new Error(
        response.error.message || 'Failed to send email via Resend',
      );
    }

    return response;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

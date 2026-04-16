/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Resend } from 'resend';
import { env } from './env';

type SendAuthEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
  template?: {
    id: string;
    variables?: Record<string, string | number>;
  };
};

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

async function sendTemplateEmailViaApi({
  to,
  subject,
  template,
}: {
  to: string;
  subject: string;
  template: {
    id: string;
    variables?: Record<string, string | number>;
  };
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.resendFromEmail,
      to,
      subject,
      template: {
        id: template.id,
        variables: template.variables,
      },
    }),
  });

  const result = (await response.json()) as {
    id?: string;
    name?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      result.message || 'Failed to send template email via Resend',
    );
  }

  return result;
}

export async function sendAuthEmail({
  to,
  subject,
  text,
  html,
  template,
}: SendAuthEmailInput) {
  if (!resend) {
    console.error('RESEND_API_KEY is not set');
    throw new Error('RESEND_API_KEY is not set');
  }

  try {
    if (template?.id) {
      return await sendTemplateEmailViaApi({
        to,
        subject,
        template,
      });
    }

    const payload: Record<string, unknown> = {
      from: env.resendFromEmail,
      to,
      subject,
      text,
      html,
    };

    const response = await resend.emails.send(payload as any);

    // Resend may return { data: null, error: {...} } without throwing.
    // Treat that as a failed send so auth flow can surface a real error.
    if (response.error) {
      console.error(`Resend rejected email to ${to}:`, response.error);
      throw new Error(
        response.error.message || 'Failed to send email via Resend',
      );
    } else {
      return response;
    }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

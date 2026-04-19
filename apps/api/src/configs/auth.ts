import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../shared/database/prisma.service';
import { env } from './env';
import { sendAuthEmail } from './email';
import { getAuthBaseURL } from './base-url';

// Use the centralized database connection
const db = new PrismaService();

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  basePath: '/api/v1/auth',
  secret: env.authSecret,
  baseURL: getAuthBaseURL(env.authUrl),
  trustedOrigins: [
    env.frontendUrl,
    'http://localhost:3000',
    'https://identitree-dev.geoplanph.com',
    'https://identitree-stg.geoplanph.com',
    'https://identitree.geoplanph.com',
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendAuthEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Reset your password using this link: ${url}`,
        html: `<p>Reset your password using this link:</p><p><a href="${url}">${url}</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // Use frontend URL for verification link so user lands on UI
      const verificationLink = token
        ? `${env.frontendUrl}/verify-email?token=${encodeURIComponent(token)}`
        : url;

      const templateId = env.resendVerifyTemplateId.trim();

      await sendAuthEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Verify your email using this link: ${verificationLink}`,
        html: `<p>Verify your email using this link:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
        template: templateId
          ? {
              id: templateId,
              variables: {
                app_name: 'Identitree',
                user_name_prefix: user.name ? ` ${user.name}` : '',
                verify_url: verificationLink,
                expires_in: '1 hour',
                support_email: 'support@kukaass.app',
                year: String(new Date().getFullYear()),
              },
            }
          : undefined,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      prompt: 'select_account',
    },
  },
});

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { DatabaseService } from './database';
import { env } from './env';
import { sendAuthEmail } from './email';

// Use the centralized database connection
const db = new DatabaseService();

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  basePath: '/auth',
  secret: env.authSecret,
  baseURL: env.authUrl,
  trustedOrigins: [env.frontendUrl],
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
      const verificationLink = token
        ? `${env.frontendUrl}/verify-email?token=${encodeURIComponent(token)}`
        : url;

      await sendAuthEmail({
        to: user.email,
        subject: 'Verify your email address',
        text: `Verify your email using this link: ${verificationLink}`,
        html: `<p>Verify your email using this link:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`,
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

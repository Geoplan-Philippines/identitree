import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { DatabaseService } from './database';
import { env } from './env';

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
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      prompt: 'select_account',
    },
  },
});

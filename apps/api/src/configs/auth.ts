import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { organization } from 'better-auth/plugins';
import { env } from './env';
import { sendAuthEmail } from './email';
import { getAuthBaseURL } from './base-url';
import { prisma } from '../shared/database/prisma';

export const auth = betterAuth({
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email' && ctx.method === 'POST') {
        const body = ctx.body as any;
        if (body?.email) {
          const user = await prisma.user.findUnique({
            where: { email: body.email },
          });
          if (user) {
            throw new APIError('BAD_REQUEST', {
              code: 'USER_ALREADY_EXISTS',
              message: 'User already exists',
            });
          }
        }
      }

      if (ctx.path === '/request-password-reset' && ctx.method === 'POST') {
        const body = ctx.body as any;
        if (body?.email) {
          const user = await prisma.user.findUnique({
            where: { email: body.email },
            include: { accounts: true },
          });

          if (!user) {
            return new Response(
              JSON.stringify({
                message: 'This email is not registered in our database.',
                code: 'USER_NOT_FOUND',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            );
          }

          const hasPasswordAccount = user.accounts.some(
            (acc) => acc.providerId === 'credential',
          );
          const hasGoogleAccount = user.accounts.some(
            (acc) => acc.providerId === 'google',
          );

          if (!hasPasswordAccount && hasGoogleAccount) {
            return new Response(
              JSON.stringify({
                message:
                  'This account uses Google Sign-In. Please log in using Google instead.',
                code: 'SOCIAL_LOGIN_ONLY',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            );
          }
        }
      }
    }),
  },
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const member = await prisma.member.findFirst({
            where: { userId: session.userId },
            orderBy: { createdAt: 'asc' },
          });

          if (member) {
            return {
              data: {
                ...session,
                activeOrganizationId: member.organizationId,
              } as any,
            };
          }
          return { data: session };
        },
      },
    },
  },
  basePath: '/api/v1/auth',
  secret: env.authSecret,
  baseURL: getAuthBaseURL(env.authUrl),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  advanced: env.authCookieDomain
    ? {
      crossSubDomainCookies: {
        enabled: true,
        domain: env.authCookieDomain,
      },
    }
    : undefined,
  trustedOrigins: [
    env.frontendUrl,
    'http://localhost:3000',
    'https://identitree-dev.geoplanph.com',
    'https://identitree-stg.geoplanph.com',
    'https://identitree-staging.geoplanph.com',
    'https://identitree.geoplanph.com',
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const resetLink = `${env.frontendUrl}/reset-password?token=${token}`;
      const templateId = env.resendResetPwTemplateId.trim();

      await sendAuthEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Reset your password using this link: ${resetLink}`,
        html: `<p>Reset your password using this link:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        template: templateId
          ? {
            id: templateId,
            variables: {
              app_name: 'Identitree',
              user_name_prefix: user.name ? ` ${user.name}` : '',
              reset_url: resetLink,
              expires_in: '1 hour',
              support_email: 'support@geoplanph.com',
              year: String(new Date().getFullYear()),
            },
          }
          : undefined,
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
              support_email: 'support@geoplanph.com',
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
  plugins: [
    organization(),
    {
      id: 'auto-organization-fallback',
      hooks: {
        after: [
          {
            matcher: (ctx: any) => ctx.path === '/get-session' && ctx.method === 'GET',
            handler: createAuthMiddleware(async (ctx: any) => {
              const data = ctx.returned;
              if (data?.session && data?.user && !data.session.activeOrganizationId) {
                const member = await prisma.member.findFirst({
                  where: { userId: data.user.id },
                  orderBy: { createdAt: 'asc' },
                });

                if (member) {
                  // Update the database so it's persisted
                  await prisma.session.update({
                    where: { id: data.session.id },
                    data: { activeOrganizationId: member.organizationId } as any,
                  }).catch(err => {
                    console.error('Failed to auto-set active organization in session hook:', err);
                  });

                  // Update the response data so the client sees it immediately
                  data.session.activeOrganizationId = member.organizationId;
                }
              }
            }),
          },
        ],
      },
    },
  ],
});

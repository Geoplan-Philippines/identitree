import dotenv from 'dotenv';

dotenv.config();

export const env = {
  databaseUrl: process.env.DATABASE_URL || '',
  port: Number(process.env.PORT || 8000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  authSecret: process.env.BETTER_AUTH_SECRET || '',
  authUrl: process.env.BETTER_AUTH_URL || 'http://localhost:8000/api/v1',
  authCookieDomain: process.env.BETTER_AUTH_COOKIE_DOMAIN || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  resendVerifyTemplateId: process.env.RESEND_VERIFY_TEMPLATE_ID || '',

  // Cloudinary
  cloudName: process.env.CLOUD_NAME || '',
  presetName: process.env.PRESET_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_KEY_SECRET || '',
  cloudinaryBaseUrl: process.env.CLOUDINARY_BASE_URL || 'https://api.cloudinary.com/v1_1',
};

import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TemplateAvailability } from '@prisma/client';
import { env } from '../../configs/env';

dotenv.config();

async function seedTemplates() {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.databaseUrl,
    }),
  });

  console.log('🌱 Seeding templates...');

  const templates = [
    {
      id: 'tpl_default',
      name: 'Default',
      layoutKey: 'default',
      availability: TemplateAvailability.GLOBAL,
      category: 'Minimalist',
    },
    {
      id: 'tpl_modern_dark',
      name: 'Modern Dark',
      layoutKey: 'modern-dark',
      availability: TemplateAvailability.GLOBAL,
      category: 'Premium',
    },
    {
      id: 'tpl_glass',
      name: 'Glass',
      layoutKey: 'glass',
      availability: TemplateAvailability.GLOBAL,
      category: 'Futuristic',
    },
  ];

  try {
    for (const template of templates) {
      await prisma.template.upsert({
        where: { id: template.id },
        update: {}, // Don't change anything if it already exists
        create: {
          id: template.id,
          name: template.name,
          layoutKey: template.layoutKey,
          availability: template.availability,
          category: template.category,
        },
      });
      console.log(`✅ Upserted template: ${template.name} (${template.id})`);
    }
    console.log('✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

void seedTemplates();

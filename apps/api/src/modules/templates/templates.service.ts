import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Template } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';
import { AuthContext } from '../../common/decorators/current-user.decorator';
import { CreateTemplateDTO } from './dto/create-template.dto';
import { UpdateTemplateDTO } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: AuthContext): Promise<Template[]> {
    const { organizationId } = user;

    return this.prisma.template.findMany({
      where: {
        OR: [
          { availability: 'GLOBAL' },
          { organizationId: organizationId },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: AuthContext): Promise<Template> {
    const { organizationId } = user;

    const template = await this.prisma.template.findFirst({
      where: {
        id,
        OR: [
          { availability: 'GLOBAL' },
          { organizationId: organizationId },
        ],
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }

    return template;
  }

  async create(user: AuthContext, payload: CreateTemplateDTO): Promise<Template> {
    const { organizationId } = user;

    if (!organizationId) {
      throw new ForbiddenException(
        'You must belong to an organization to create templates',
      );
    }

    return this.prisma.template.create({
      data: {
        ...payload,
        organizationId,
        availability: 'ORG_ONLY',
      },
    });
  }

  async update(id: string, user: AuthContext, payload: UpdateTemplateDTO): Promise<Template> {
    const { organizationId } = user;

    const template = await this.prisma.template.findFirst({
      where: {
        id,
        organizationId, // Only owner organization can update
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found or you don't have permission to update it`);
    }

    return this.prisma.template.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string, user: AuthContext): Promise<void> {
    const { organizationId } = user;

    const template = await this.prisma.template.findFirst({
      where: {
        id,
        organizationId, // Only owner organization can delete
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found or you don't have permission to delete it`);
    }

    await this.prisma.template.delete({
      where: { id },
    });
  }
}

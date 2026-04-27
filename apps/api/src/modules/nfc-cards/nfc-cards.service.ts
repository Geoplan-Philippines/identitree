import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NfcCard, Prisma } from '@prisma/client';


import { PrismaService } from '../../shared/database/prisma.service';
import { AuthContext } from '../../common/decorators/current-user.decorator';
import { CreateNfcCardDTO } from './dto/create-nfc-card.dto';
import { slugify } from './slugify';
import { env } from '../../configs/env';

type CreateNfcCardInput = {
  user: AuthContext;
  payload: CreateNfcCardDTO;
};

@Injectable()
export class NfcCardsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Creates a new NFC card scoped to the user's organization.
   *
   * Uses the organization context provided by the session.
   */
  async createNfcCard({
    user,
    payload,
  }: CreateNfcCardInput): Promise<NfcCard> {
    const { organizationId } = user;

    if (!organizationId) {
      throw new ForbiddenException(
        'You must select or create an organization before performing this action',
      );
    }


    // Fetch organization slug
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { slug: true },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Generate slug and encodedUrl from name
    const slug = slugify(payload.name);
    const encodedUrl = `${env.frontendUrl}/${organization.slug}/${slug}`;

    // Remove name from payload before saving
    const { name, ...rest } = payload;

    try {
      return await this.prisma.nfcCard.create({
        data: {
          organizationId: organizationId,
          ...rest,
          encodedUrl,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is the error code for unique constraint violation
        if (error.code === 'P2002') {
          throw new ConflictException(
            'A card with this hardware ID already exists',
          );
        }
      }
      throw error;
    }
  }

  /**
   * Returns all NFC cards that belong to the user's organization.
   *
   * Uses the organization context provided by the session.
   */
  async getAllNfcCardsByOrganizationId(
    user: AuthContext,
  ): Promise<NfcCard[]> {
    const { organizationId } = user;

    if (!organizationId) {
      throw new ForbiddenException(
        'You must select or create an organization before performing this action',
      );
    }

    return this.prisma.nfcCard.findMany({
      where: { organizationId: organizationId },
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns a single NFC card by its ID.
   *
   * Throws NotFoundException if the card does not exist.
   */
  async getNfcCardById(id: string): Promise<NfcCard> {
    const card = await this.prisma.nfcCard.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!card) {
      throw new NotFoundException(`NFC card with id "${id}" was not found`);
    }

    return card;
  }

  /**
   * Updates an NFC card by its ID.
   */
  async updateNfcCard(id: string, data: Partial<NfcCard>): Promise<NfcCard> {
    const card = await this.prisma.nfcCard.findUnique({ where: { id } });

    if (!card) {
      throw new NotFoundException(`NFC card with id "${id}" was not found`);
    }

    return this.prisma.nfcCard.update({
      where: { id },
      data,
      include: { profile: true },
    });
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NfcCard } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';
import { AuthContext } from '../../common/decorators/current-user.decorator';
import { CreateNfcCardDTO } from './dto/create-nfc-card.dto';

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

    return this.prisma.nfcCard.create({
      data: {
        organizationId: organizationId,
        ...payload,
      },
    });
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
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns a single NFC card by its ID.
   *
   * Throws NotFoundException if the card does not exist.
   */
  async getNfcCardById(id: string): Promise<NfcCard> {
    const card = await this.prisma.nfcCard.findUnique({ where: { id } });

    if (!card) {
      throw new NotFoundException(`NFC card with id "${id}" was not found`);
    }

    return card;
  }
}

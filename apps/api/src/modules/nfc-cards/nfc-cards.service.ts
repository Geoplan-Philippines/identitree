import { Injectable, NotFoundException } from '@nestjs/common';
import { NfcCard } from '@prisma/client';

import { PrismaService } from '../../shared/database/prisma.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateNfcCardDTO } from './dto/create-nfc-card.dto';

type CreateNfcCardInput = {
  currentUserId: string;
  payload: CreateNfcCardDTO;
};

@Injectable()
export class NfcCardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  /**
   * Creates a new NFC card scoped to the user's organization.
   *
   * Resolves the organization first, then persists the card with
   * the resolved organizationId.
   */
  async createNfcCard({
    currentUserId,
    payload,
  }: CreateNfcCardInput): Promise<NfcCard> {
    const organization =
      await this.organizationsService.resolveUserOrganization(currentUserId);

    return this.prisma.nfcCard.create({
      data: {
        organizationId: organization.id,
        ...payload,
      },
    });
  }

  /**
   * Returns all NFC cards that belong to the user's organization.
   *
   * Resolves the organization first so cards from other orgs are
   * never exposed, even if the caller supplies a spoofed ID.
   */
  async getAllNfcCardsByOrganizationId(
    currentUserId: string,
  ): Promise<NfcCard[]> {
    const organization =
      await this.organizationsService.resolveUserOrganization(currentUserId);

    return this.prisma.nfcCard.findMany({
      where: { organizationId: organization.id },
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

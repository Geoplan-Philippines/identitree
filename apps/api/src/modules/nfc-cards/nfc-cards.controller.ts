import { Body, Controller, Get, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { NfcCard } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { NfcCardsService } from './nfc-cards.service';
import { CreateNfcCardDTO } from './dto/create-nfc-card.dto';

@Controller('nfc-cards')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class NfcCardsController {
  constructor(private readonly nfcCardsService: NfcCardsService) {}

  /**
   * Creates a new NFC card for the authenticated user's organization.
   */
  @Post()
  async createNfcCard(
    @CurrentUser() currentUserId: string,
    @Body() createNfcCardDTO: CreateNfcCardDTO,
  ): Promise<NfcCard> {
    return this.nfcCardsService.createNfcCard({
      currentUserId,
      payload: createNfcCardDTO,
    });
  }

  /**
   * Returns all NFC cards belonging to the authenticated user's organization.
   */
  @Get()
  async getAllNfcCardsByOrganizationId(
    @CurrentUser() currentUserId: string,
  ): Promise<NfcCard[]> {
    return this.nfcCardsService.getAllNfcCardsByOrganizationId(currentUserId);
  }

  /**
   * Returns a single NFC card by ID. Throws 404 if not found.
   */
  @Get(':id')
  async getNfcCardById(@Param('id') id: string): Promise<NfcCard> {
    return this.nfcCardsService.getNfcCardById(id);
  }
}

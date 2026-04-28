import { Body, Controller, Get, Param, Post, UseFilters, UseInterceptors, Patch } from '@nestjs/common';
import { NfcCard } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthContext } from '../../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { NfcCardsService } from './nfc-cards.service';
import { CreateNfcCardDTO } from './dto/create-nfc-card.dto';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';
import { UpdateNfcCardDTO } from './dto/update-nfc-card.dto';

@Controller('nfc-cards')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class NfcCardsController {
  constructor(private readonly nfcCardsService: NfcCardsService) { }

  /**
   * Creates a new NFC card for the authenticated user's organization.
   */
  @RateLimit(10, 60000)
  @Post()
  async createNfcCard(
    @CurrentUser() user: AuthContext,
    @Body() createNfcCardDTO: CreateNfcCardDTO,
  ): Promise<NfcCard> {
    return this.nfcCardsService.createNfcCard({
      user,
      payload: createNfcCardDTO,
    });
  }

  /**
   * Returns all NFC cards belonging to the authenticated user's organization.
   */
  @RateLimit(20, 60000)
  @Get()
  async getAllNfcCardsByOrganizationId(
    @CurrentUser() user: AuthContext,
  ): Promise<NfcCard[]> {
    return this.nfcCardsService.getAllNfcCardsByOrganizationId(user);
  }

  /**
   * Returns a single NFC card by ID. Throws 404 if not found.
   */
  @RateLimit(20, 60000)
  @Get(':id')
  async getNfcCardById(@Param('id') id: string): Promise<NfcCard> {
    return this.nfcCardsService.getNfcCardById(id);
  }

  /**
   * Updates an NFC card by ID.
   */
  @RateLimit(20, 60000)
  @Patch(':id')
  async updateNfcCard(
    @Param('id') id: string,
    @Body() body: UpdateNfcCardDTO,
  ): Promise<NfcCard> {
    return this.nfcCardsService.updateNfcCard(id, body as any);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Template } from '@prisma/client';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthContext } from '../../common/decorators/current-user.decorator';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { TemplatesService } from './templates.service';
import { CreateTemplateDTO } from './dto/create-template.dto';
import { UpdateTemplateDTO } from './dto/update-template.dto';
import { RateLimit } from '../../common/decorators/rate-limit.decorator';

@Controller('templates')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @RateLimit(20, 60000)
  @Get()
  async findAll(@CurrentUser() user: AuthContext): Promise<Template[]> {
    return this.templatesService.findAll(user);
  }

  @RateLimit(20, 60000)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthContext,
  ): Promise<Template> {
    return this.templatesService.findOne(id, user);
  }

  @RateLimit(10, 60000)
  @Post()
  async create(
    @CurrentUser() user: AuthContext,
    @Body() createTemplateDto: CreateTemplateDTO,
  ): Promise<Template> {
    return this.templatesService.create(user, createTemplateDto);
  }

  @RateLimit(20, 60000)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthContext,
    @Body() updateTemplateDto: UpdateTemplateDTO,
  ): Promise<Template> {
    return this.templatesService.update(id, user, updateTemplateDto);
  }

  @RateLimit(10, 60000)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthContext,
  ): Promise<void> {
    return this.templatesService.remove(id, user);
  }
}

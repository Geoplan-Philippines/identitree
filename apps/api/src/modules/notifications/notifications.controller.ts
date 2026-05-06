import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthContext } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: AuthContext) {
    return this.notificationsService.findAll(user.userId);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: AuthContext) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.notificationsService.delete(id, user.userId);
  }
}

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventModule } from 'src/event/event.module';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [EventModule, SendgridModule],
  providers: [NotificationService],
})
export class NotificationModule {}

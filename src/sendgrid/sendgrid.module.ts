import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEntity } from 'src/event/entities/event.entity';
import { EventService } from 'src/event/event.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly eventService: EventService,
    private readonly sendgridService: SendgridService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS) // Adjust as needed
  async sendNotifications() {
    const currentDateTime = new Date();
    const next30SecondsDateTime = new Date(
      currentDateTime.getTime() + 30 * 1000,
    ); // Add 30 seconds
    const events = await this.eventService.getEventsByStartDate(
      currentDateTime,
      next30SecondsDateTime,
    );

    this.logger.log(`Found ${events.length} events to notify`);

    events.forEach((event) => {
      // Logic to send notification (e.g., send email, trigger browser notification)
      this.sendNotification(event);
    });
  }

  async sendNotification(event: EventEntity) {
    // Implementation of notification sending logic
    console.log('Sending notification for event: ', event);

    const mail = {
      to: event.participants,
      subject: 'Hello from sendgrid',
      from: 'hello@test.com', // Fill it with your validated email on SendGrid account
      text: 'Hello',
      html: '<h1>Hello</h1>',
    };

    return await this.sendgridService.send(mail);
  }
}

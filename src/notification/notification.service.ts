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

    for (const event of events) {
      // Logic to send notification (e.g., send email, trigger browser notification)
      await this.sendNotification(event);
    }
  }

  async sendNotification(event: EventEntity) {
    // Implementation of notification sending logic
    this.logger.log('Sending notification for event: ', event);

    const mail = {
      to: event?.participants || ['nikhil.shrestha1995@gmail.com'],
      subject: 'Hello from Calendar App',
      from: 'nikhil.shrestha1995@gmail.com', // Fill it with your validated email on SendGrid account
      text: 'Hello',
      html: `<h1>Hello</h1><p>This is a test notification.</p><br/><br/><table><tr><th align="left">Title</th><td>${event?.title}</td></tr><tr><th align="left">Start Date</th><td>${new Date(event?.startDateTime)}</td></tr></table>`,
    };

    try {
      await this.sendgridService.send(mail);
      this.logger.log('Notification sent successfully.');
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      // Handle error (e.g., log, retry, etc.)
    }
  }

  async testNotification() {
    const mail = {
      to: 'nikhil.shrestha1995@gmail.com',
      subject: 'Hello from sendgrid',
      from: 'nikhil.shrestha1995@gmail.com', // Fill it with your validated email on SendGrid account
      text: 'Hello',
      html: '<h1>Hello</h1><p>This is a test notification.</p><br/><br/><table><tr><th align="left">Title</th><td>Test</td></tr><tr><th align="left">Start Date</th><td>12323123</td></tr></table>',
    };

    // try {
    //   await this.sendgridService.send(mail);
    //   this.logger.log('Notification sent successfully.');
    // } catch (error) {
    //   this.logger.error('Error sending notification:', error.message);
    //   // Handle error (e.g., log, retry, etc.)
    // }

    return this.sendgridService.send(mail);
  }
}

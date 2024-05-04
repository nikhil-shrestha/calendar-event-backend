import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetFilterDto } from './dto/get-filter.dto';
import axios from 'axios';

@Injectable()
export class HolidayService {
  private readonly logger = new Logger(HolidayService.name);

  constructor(private configService: ConfigService) {}

  async getHolidays(filterDto: GetFilterDto) {
    const { country, year } = filterDto;
    this.logger.log('country', country);
    const apiKey = this.configService.get('HOLIDAY_API_KEY');
    const url = `${this.configService.get('HOLIDAY_API_URL')}/holidays?pretty&key=${apiKey}&country=${country}&year=${year}`;

    try {
      const response = await axios.get(url);
      return response.data.holidays;
    } catch (err) {
      this.logger.error('Error: ', err.message);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  async getCountries() {
    const apiKey = this.configService.get('HOLIDAY_API_KEY');
    const url = `${this.configService.get('HOLIDAY_API_URL')}/countries?pretty&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      return response.data.countries;
    } catch (err) {
      this.logger.error('Error: ', err.message);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetFilterDto } from './dto/get-filter.dto';
import axios from 'axios';

@Injectable()
export class HolidayService {
  constructor(private configService: ConfigService) {}

  async getHolidays(filterDto: GetFilterDto) {
    const { country, year } = filterDto;
    console.log('country', country);
    const apiKey = this.configService.get('HOLIDAY_API_KEY');
    const url = `${this.configService.get('HOLIDAY_API_URL')}/holidays?pretty&key=${apiKey}&country=${country}&year=${year}`;

    try {
      const response = await axios.get(url);
      return response.data.holidays;
    } catch (err) {
      console.log('Error: ', err.message);
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
      console.log('Error: ', err.message);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }
}

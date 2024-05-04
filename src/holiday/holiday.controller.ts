import { Controller, Get, Query } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { GetFilterDto } from './dto/get-filter.dto';

@Controller('holidays')
export class HolidayController {
  constructor(private holidayService: HolidayService) {}

  @Get()
  getTasks(@Query() filterDto: GetFilterDto) {
    return this.holidayService.getHolidays(filterDto);
  }

  @Get('countries')
  getCountries() {
    return this.holidayService.getCountries();
  }
}

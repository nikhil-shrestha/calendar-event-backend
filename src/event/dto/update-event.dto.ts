import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends CreateEventDto {
  @ValidateIf((object, value) => value)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}

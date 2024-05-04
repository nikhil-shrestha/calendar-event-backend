import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'minLength-{"ln":2,"count":2}',
  })
  @MaxLength(100, {
    message: 'maxLength-{"ln":100,"count":100}',
  })
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsArray()
  @IsEmail({}, { each: true })
  participants: string[];
}

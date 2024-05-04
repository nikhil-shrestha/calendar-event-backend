import { IsOptional, IsString } from 'class-validator';

export class GetFilterDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  year?: string;
}

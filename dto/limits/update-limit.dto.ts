import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateLimitDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  kcal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  saturatedFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salt?: number;
}

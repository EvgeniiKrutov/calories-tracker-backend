import { IsString, IsNumber, IsISO8601 } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  category: string;

  @IsISO8601()
  date: string;

  @IsNumber()
  kcal: number;

  @IsNumber()
  fat: number;

  @IsNumber()
  saturatedFat: number;

  @IsNumber()
  protein: number;

  @IsNumber()
  salt: number;

  @IsNumber()
  sugar: number;

  @IsNumber()
  carb: number;
}

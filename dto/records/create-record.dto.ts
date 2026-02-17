import { IsString, IsNumber, IsISO8601, IsUUID } from 'class-validator';

export class CreateRecordDto {
  @IsUUID()
  userId: string;

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
  carb: number;

  @IsNumber()
  sugar: number;

  @IsNumber()
  salt: number;

  @IsNumber()
  fibre: number;
}

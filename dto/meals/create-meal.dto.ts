import { IsString, IsNumber } from 'class-validator';

export class CreateMealDto {
  @IsString()
  name: string;

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

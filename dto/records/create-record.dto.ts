import { IsString, IsNumber, IsISO8601, IsUUID } from 'class-validator';

export class CreateRecordDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  mealId!: string;

  @IsString()
  category!: string;

  @IsISO8601()
  date!: string;

  @IsNumber()
  grams!: number;
}

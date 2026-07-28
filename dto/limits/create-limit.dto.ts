import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateLimitDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Min(0)
  kcal!: number;

  @IsNumber()
  @Min(0)
  saturatedFat!: number;

  @IsNumber()
  @Min(0)
  sugar!: number;

  @IsNumber()
  @Min(0)
  salt!: number;
}

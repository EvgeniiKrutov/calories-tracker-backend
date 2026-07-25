import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';

export enum ChartPeriod {
  Week = 'week',
  Month = 'month',
  Custom = 'custom',
}

export enum ChartCategory {
  SaturatedFat = 'saturatedFat',
  Sugar = 'sugar',
  Salt = 'salt',
  Kcal = 'kcal',
}

export class ChartQueryDto {
  @IsUUID()
  userId!: string;

  @IsEnum(ChartPeriod)
  period!: ChartPeriod;

  @IsEnum(ChartCategory)
  category!: ChartCategory;

  @ValidateIf((o: ChartQueryDto) => o.period === ChartPeriod.Custom)
  @IsString()
  start?: string;

  @ValidateIf((o: ChartQueryDto) => o.period === ChartPeriod.Custom)
  @IsString()
  end?: string;
}

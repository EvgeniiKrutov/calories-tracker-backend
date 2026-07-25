import { IsISO8601, IsUUID } from 'class-validator';

export class DailySummaryQueryDto {
  @IsUUID()
  userId!: string;

  @IsISO8601()
  date!: string;
}

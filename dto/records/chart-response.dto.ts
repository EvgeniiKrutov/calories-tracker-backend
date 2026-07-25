import { ChartCategory, ChartPeriod } from './chart-query.dto';

export class ChartPointDto {
  date!: string;
  value!: number;
}

export class ChartResponseDto {
  userId!: string;
  category!: ChartCategory;
  period!: ChartPeriod;
  start!: string;
  end!: string;
  points!: ChartPointDto[];
}

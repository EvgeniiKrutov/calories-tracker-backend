import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';
import { Meal } from '../meals/meal.entity';
import { CreateRecordDto } from '../../dto/records/create-record.dto';
import { UpdateRecordDto } from '../../dto/records/update-record.dto';
import { RecordResponseDto } from '../../dto/records/record-response.dto';
import { PaginationQueryDto } from '../../dto/common/pagination-query.dto';
import { PaginatedResponseDto } from '../../dto/common/paginated-response.dto';
import { DailySummaryQueryDto } from '../../dto/records/daily-summary-query.dto';
import { DailySummaryResponseDto } from '../../dto/records/daily-summary-response.dto';
import {
  ChartQueryDto,
  ChartPeriod,
} from '../../dto/records/chart-query.dto';
import { ChartResponseDto } from '../../dto/records/chart-response.dto';
import { roundTo2 } from '../../utils/rounding';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
  ) {}

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Record>> {
    const { page, limit } = query;
    const [data, total] = await this.recordsRepository.findAndCount({
      order: { date: 'DESC', category: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async dailySummary(
    query: DailySummaryQueryDto,
  ): Promise<DailySummaryResponseDto> {
    const { userId, date } = query;
    const day = date.slice(0, 10);
    const next = new Date(`${day}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const nextDay = next.toISOString().slice(0, 10);

    const result = await this.recordsRepository
      .createQueryBuilder('record')
      .select('COALESCE(SUM(record.kcal), 0)', 'kcal')
      .addSelect('COALESCE(SUM(record.fat), 0)', 'fat')
      .addSelect('COALESCE(SUM(record.saturatedFat), 0)', 'saturatedFat')
      .addSelect('COALESCE(SUM(record.protein), 0)', 'protein')
      .addSelect('COALESCE(SUM(record.carb), 0)', 'carb')
      .addSelect('COALESCE(SUM(record.sugar), 0)', 'sugar')
      .addSelect('COALESCE(SUM(record.salt), 0)', 'salt')
      .addSelect('COALESCE(SUM(record.fibre), 0)', 'fibre')
      .where('record.userId = :userId', { userId })
      .andWhere('record.date >= :day', { day })
      .andWhere('record.date < :nextDay', { nextDay })
      .getRawOne<{
        kcal: string;
        fat: string;
        saturatedFat: string;
        protein: string;
        carb: string;
        sugar: string;
        salt: string;
        fibre: string;
      }>();

    return {
      userId,
      date,
      kcal: Number(result?.kcal ?? 0),
      fat: Number(result?.fat ?? 0),
      saturatedFat: Number(result?.saturatedFat ?? 0),
      protein: Number(result?.protein ?? 0),
      carb: Number(result?.carb ?? 0),
      sugar: Number(result?.sugar ?? 0),
      salt: Number(result?.salt ?? 0),
      fibre: Number(result?.fibre ?? 0),
    };
  }

  async chart(query: ChartQueryDto): Promise<ChartResponseDto> {
    const { userId, period, category } = query;
    const { start, end } = this.resolveRange(query);

    const rows = await this.recordsRepository
      .createQueryBuilder('record')
      .select('SUBSTR(record.date, 1, 10)', 'date')
      .addSelect(`COALESCE(SUM(record.${category}), 0)`, 'value')
      .where('record.userId = :userId', { userId })
      .andWhere('record.date >= :start', { start })
      .andWhere('record.date < :end', { end })
      .groupBy('SUBSTR(record.date, 1, 10)')
      .orderBy('SUBSTR(record.date, 1, 10)', 'ASC')
      .getRawMany<{ date: string; value: string }>();

    return {
      userId,
      category,
      period,
      start,
      end,
      points: rows.map((row) => ({
        date: row.date,
        value: roundTo2(Number(row.value)),
      })),
    };
  }

  private resolveRange(query: ChartQueryDto): { start: string; end: string } {
    if (query.period === ChartPeriod.Custom) {
      const startDay = query.start!.slice(0, 10);
      const endDate = new Date(`${query.end!.slice(0, 10)}T00:00:00.000Z`);
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      return { start: startDay, end: endDate.toISOString().slice(0, 10) };
    }

    const days = query.period === ChartPeriod.Week ? 7 : 30;
    const now = new Date();
    const end = new Date(`${now.toISOString().slice(0, 10)}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - days);
    return {
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    };
  }

  async findOne(id: string): Promise<RecordResponseDto> {
    const record = await this.recordsRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return {
      id: record.id,
      mealName: record.mealName,
      category: record.category,
      date: record.date,
      grams: record.grams,
    };
  }

  async create(dto: CreateRecordDto): Promise<Record> {
    const meal = await this.getMeal(dto.mealId);
    const record = this.recordsRepository.create({
      userId: dto.userId,
      mealId: dto.mealId,
      mealName: meal.name,
      category: dto.category,
      date: dto.date,
      grams: roundTo2(dto.grams),
      ...this.calculateNutrition(meal, dto.grams),
    });
    return this.recordsRepository.save(record);
  }

  async update(id: string, dto: UpdateRecordDto): Promise<Record> {
    const record = await this.recordsRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }

    const mealId = dto.mealId ?? record.mealId;
    const grams = dto.grams ?? record.grams;
    const meal = await this.getMeal(mealId);

    Object.assign(record, {
      userId: dto.userId ?? record.userId,
      mealId,
      mealName: meal.name,
      category: dto.category ?? record.category,
      date: dto.date ?? record.date,
      grams: roundTo2(grams),
      ...this.calculateNutrition(meal, grams),
    });
    return this.recordsRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.recordsRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    await this.recordsRepository.remove(record);
  }

  private async getMeal(mealId: string): Promise<Meal> {
    const meal = await this.mealsRepository.findOneBy({ id: mealId });
    if (!meal) {
      throw new NotFoundException(`Meal with id "${mealId}" not found`);
    }
    return meal;
  }

  private calculateNutrition(meal: Meal, grams: number) {
    const factor = grams / 100;
    return {
      kcal: roundTo2(meal.kcal * factor),
      fat: roundTo2(meal.fat * factor),
      saturatedFat: roundTo2(meal.saturatedFat * factor),
      protein: roundTo2(meal.protein * factor),
      carb: roundTo2(meal.carb * factor),
      sugar: roundTo2(meal.sugar * factor),
      salt: roundTo2(meal.salt * factor),
      fibre: roundTo2(meal.fibre * factor),
    };
  }
}

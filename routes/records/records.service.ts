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
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
      grams: dto.grams,
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
      grams,
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
      kcal: meal.kcal * factor,
      fat: meal.fat * factor,
      saturatedFat: meal.saturatedFat * factor,
      protein: meal.protein * factor,
      carb: meal.carb * factor,
      sugar: meal.sugar * factor,
      salt: meal.salt * factor,
      fibre: meal.fibre * factor,
    };
  }
}

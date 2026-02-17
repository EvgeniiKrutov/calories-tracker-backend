import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';
import { CreateMealDto } from 'dto/meals/create-meal.dto';
import { UpdateMealDto } from 'dto/meals/update-meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private readonly mealsRepository: Repository<Meal>,
  ) {}

  async findAll(): Promise<Meal[]> {
    return this.mealsRepository.find();
  }

  async findOne(id: string): Promise<Meal> {
    const meal = await this.mealsRepository.findOneBy({ id });
    if (!meal) {
      throw new NotFoundException(`Meal with id "${id}" not found`);
    }
    return meal;
  }

  async create(dto: CreateMealDto): Promise<Meal> {
    const meal = this.mealsRepository.create(dto);
    return this.mealsRepository.save(meal);
  }

  async update(id: string, dto: UpdateMealDto): Promise<Meal> {
    const meal = await this.findOne(id);
    Object.assign(meal, dto);
    return this.mealsRepository.save(meal);
  }

  async remove(id: string): Promise<void> {
    const meal = await this.findOne(id);
    await this.mealsRepository.remove(meal);
  }
}

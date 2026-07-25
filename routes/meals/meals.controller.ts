import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Meal } from './meal.entity';
import { CreateMealDto } from 'dto/meals/create-meal.dto';
import { UpdateMealDto } from 'dto/meals/update-meal.dto';
import { MealsService } from './meals.service';
import { PaginationQueryDto } from 'dto/common/pagination-query.dto';
import { PaginatedResponseDto } from 'dto/common/paginated-response.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Meal>> {
    return this.mealsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Meal> {
    return this.mealsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMealDto): Promise<Meal> {
    return this.mealsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMealDto,
  ): Promise<Meal> {
    return this.mealsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mealsService.remove(id);
  }
}

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
import { Limit } from './limit.entity';
import { CreateLimitDto } from '../../dto/limits/create-limit.dto';
import { UpdateLimitDto } from '../../dto/limits/update-limit.dto';
import { LimitsService } from './limits.service';
import { PaginationQueryDto } from '../../dto/common/pagination-query.dto';
import { PaginatedResponseDto } from '../../dto/common/paginated-response.dto';

@Controller('limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Limit>> {
    return this.limitsService.findAll(query);
  }

  @Get(':userId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string): Promise<Limit> {
    return this.limitsService.findOne(userId);
  }

  @Post()
  create(@Body() dto: CreateLimitDto): Promise<Limit> {
    return this.limitsService.create(dto);
  }

  @Put(':userId')
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateLimitDto,
  ): Promise<Limit> {
    return this.limitsService.update(userId, dto);
  }

  @Delete(':userId')
  remove(@Param('userId', ParseUUIDPipe) userId: string): Promise<void> {
    return this.limitsService.remove(userId);
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Limit } from './limit.entity';
import { CreateLimitDto } from '../../dto/limits/create-limit.dto';
import { UpdateLimitDto } from '../../dto/limits/update-limit.dto';
import { PaginationQueryDto } from '../../dto/common/pagination-query.dto';
import { PaginatedResponseDto } from '../../dto/common/paginated-response.dto';
import { roundNumericFields } from '../../utils/rounding';

const LIMIT_NUMERIC_FIELDS: (keyof Limit)[] = [
  'kcal',
  'saturatedFat',
  'sugar',
  'salt',
];

@Injectable()
export class LimitsService {
  constructor(
    @InjectRepository(Limit)
    private readonly limitsRepository: Repository<Limit>,
  ) {}

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Limit>> {
    const { page, limit } = query;
    const [data, total] = await this.limitsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(userId: string): Promise<Limit> {
    const limit = await this.limitsRepository.findOneBy({ userId });
    if (!limit) {
      throw new NotFoundException(`Limit for user "${userId}" not found`);
    }
    return limit;
  }

  async create(dto: CreateLimitDto): Promise<Limit> {
    const existing = await this.limitsRepository.findOneBy({
      userId: dto.userId,
    });
    if (existing) {
      throw new ConflictException(
        `Limit for user "${dto.userId}" already exists`,
      );
    }

    const limit = this.limitsRepository.create(
      roundNumericFields(dto, LIMIT_NUMERIC_FIELDS as (keyof CreateLimitDto)[]),
    );
    return this.limitsRepository.save(limit);
  }

  async update(userId: string, dto: UpdateLimitDto): Promise<Limit> {
    const limit = await this.findOne(userId);
    Object.assign(
      limit,
      roundNumericFields(dto, LIMIT_NUMERIC_FIELDS as (keyof UpdateLimitDto)[]),
    );
    return this.limitsRepository.save(limit);
  }

  async remove(userId: string): Promise<void> {
    const limit = await this.findOne(userId);
    await this.limitsRepository.remove(limit);
  }
}

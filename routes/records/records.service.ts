import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';
import { CreateRecordDto } from '../../dto/records/create-record.dto';
import { UpdateRecordDto } from '../../dto/records/update-record.dto';
import { PaginationQueryDto } from '../../dto/common/pagination-query.dto';
import { PaginatedResponseDto } from '../../dto/common/paginated-response.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
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

  async findOne(id: string): Promise<Record> {
    const record = await this.recordsRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return record;
  }

  async create(dto: CreateRecordDto): Promise<Record> {
    const record = this.recordsRepository.create(dto);
    return this.recordsRepository.save(record);
  }

  async update(id: string, dto: UpdateRecordDto): Promise<Record> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.recordsRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordsRepository.remove(record);
  }
}

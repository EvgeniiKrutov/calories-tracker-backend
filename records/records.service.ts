import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';
import { CreateRecordDto } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordsRepository: Repository<Record>,
  ) {}

  async findAll(): Promise<Record[]> {
    return this.recordsRepository.find({ order: { date: 'DESC' } });
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

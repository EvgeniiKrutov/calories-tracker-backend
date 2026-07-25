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
import { RecordsService } from './records.service';
import { CreateRecordDto } from '../../dto/records/create-record.dto';
import { UpdateRecordDto } from '../../dto/records/update-record.dto';
import { Record } from './record.entity';
import { RecordResponseDto } from '../../dto/records/record-response.dto';
import { PaginationQueryDto } from '../../dto/common/pagination-query.dto';
import { PaginatedResponseDto } from 'dto/common/paginated-response.dto';
import { DailySummaryQueryDto } from '../../dto/records/daily-summary-query.dto';
import { DailySummaryResponseDto } from '../../dto/records/daily-summary-response.dto';
import { ChartQueryDto } from '../../dto/records/chart-query.dto';
import { ChartResponseDto } from '../../dto/records/chart-response.dto';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<Record>> {
    return this.recordsService.findAll(query);
  }

  @Get('summary')
  dailySummary(
    @Query() query: DailySummaryQueryDto,
  ): Promise<DailySummaryResponseDto> {
    return this.recordsService.dailySummary(query);
  }

  @Get('chart')
  chart(@Query() query: ChartQueryDto): Promise<ChartResponseDto> {
    return this.recordsService.chart(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RecordResponseDto> {
    return this.recordsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRecordDto): Promise<Record> {
    return this.recordsService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecordDto,
  ): Promise<Record> {
    return this.recordsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.recordsService.remove(id);
  }
}

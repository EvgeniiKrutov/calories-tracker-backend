import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}

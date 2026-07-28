import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Limit } from './limit.entity';
import { LimitsController } from './limits.controller';
import { LimitsService } from './limits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Limit])],
  controllers: [LimitsController],
  providers: [LimitsService],
})
export class LimitsModule {}

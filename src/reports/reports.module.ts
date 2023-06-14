import { Module } from '@nestjs/common';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reports',
    }),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}

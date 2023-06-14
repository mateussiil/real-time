import { Module } from '@nestjs/common';
import { ReportsService } from './reports/reports.service';

@Module({
  providers: [ReportsService]
})
export class ReportsModule {}

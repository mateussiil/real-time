import { Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ReportsService } from '../reports/reports.service';

//It's need to have the same name of queue in reports/reports.module.ts
@Processor('reports')
export class ReportsJobService {
  constructor(private reportsService: ReportsService) {}

  produce(job: Job<{ reportId: number }>) {
    // add the report that will be executed by the job
    this.reportsService.produce(job.data.reportId);

    return {};
  }
}

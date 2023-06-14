import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Status } from '@prisma/client';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('reports')
    private reportsQueue: Queue,
  ) {}

  all() {
    return this.prismaService.report.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prismaService.report.findFirst({
      where: {
        id,
      },
    });
  }

  async request() {
    const report = await this.prismaService.report.create({
      data: {
        status: Status.PENDING,
      },
    });

    // Add the to the queue 'reports', and the values { reportId: report.id })
    this.reportsQueue.add('reports', { reportId: report.id });

    return report;
  }

  async produce(id: number) {
    await sleep(3000);
    // The job that will run by the bull
    this.prismaService.report.update({
      where: {
        id,
      },
      data: {
        status: Status.PROCESSING,
      },
    });

    const randomStatus = Math.random() > 0.5 ? Status.DONE : Status.ERROR;

    this.prismaService.report.update({
      where: {
        id,
      },
      data: {
        filename: randomStatus === Status.DONE ? `report-${id}.pdf` : null,
        status: randomStatus,
      },
    });
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

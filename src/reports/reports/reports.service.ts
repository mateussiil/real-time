import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prismaService: PrismaService) {}

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

  request() {
    return this.prismaService.report.create({
      data: {
        status: Status.PENDING,
      },
    });
  }

  async produce(id: number) {
    await sleep(3000);
    // The job that will run for the bull
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

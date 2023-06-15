import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Sse,
  Res,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Status } from '@prisma/client';
import { Observable, defer, map, repeat, tap } from 'rxjs';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('view')
  async view() {
    const reports = await this.reportsService.all();

    return { reports };
  }

  @Get()
  all() {
    return this.reportsService.all();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.reportsService.findOne(id);
  }

  @Post()
  request() {
    return this.reportsService.request();
  }

  @Sse(':id/events')
  events(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response<any>,
  ): Observable<{ type: string; data: any }> {
    // defer is a observable
    // repeat execute the function this.reportsService.findOne(id) from 1 to 1 seconds
    return defer(() => this.reportsService.findOne(id)) //Observable
      .pipe(
        repeat({
          delay: 1000,
        }),
        tap((report) => {
          if (report.status === Status.DONE || report.status === Status.ERROR) {
            //@Ao verificar que é esse status ele envia uma mensagem e fecha a conexao
            setTimeout(() => {
              response.end();
            }, 1000);
          }
        }),
        map((report) => ({
          type: 'message',
          data: report,
        })),
      );
  }
}

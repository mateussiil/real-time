import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

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
}

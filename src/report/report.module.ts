/* eslint-disable */
import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { WorkHoursModule } from 'src/work-hours/work-hours.module';

@Module({
  imports: [WorkHoursModule],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}

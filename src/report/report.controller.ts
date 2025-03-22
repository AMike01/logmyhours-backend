/* eslint-disable */
import { Controller, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { UserInfo } from 'src/auth/decorators/user-info.decorator';
import { User } from 'src/auth/types/auth';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get(':month/:year')
    async generateReport(
        @UserInfo() user: User,
        @Param('month') month: string,
        @Param('year') year: string,
        @Res() res: Response
    ) {
        try {
            const monthNumber = parseInt(month, 10);
            if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
                throw new BadRequestException('Invalid month');
            }

            const yearNumber = parseInt(year, 10);
            if (isNaN(yearNumber) || yearNumber < 1900) {
                throw new BadRequestException('Invalid year');
            }

            const xlsxBuffer = await this.reportService.generateReport(user, monthNumber, yearNumber);

            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=work_hours_${month}_${year}.xlsx`,
                'Content-Length': xlsxBuffer.length,
              });

            // Send the file buffer as a response
            res.end(xlsxBuffer);
        } catch (error) {
            console.error("Error generating XLSX file:", error);
            res.status(500).send("Error generating XLSX file.");
        }
    }
}

/* eslint-disable */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/types/auth';
import { WorkHoursService } from 'src/work-hours/work-hours.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ReportService {
    constructor(private readonly workHoursService: WorkHoursService) {}

    monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    async generateReport(user: User, month: number, year: number): Promise<Buffer> {
        
        const workHours = await this.workHoursService.findByMonthAndYear(user, month, year);

        if (!workHours || workHours.length === 0) {
            throw new InternalServerErrorException('Work hours not found');
        }

        // Sort workHours by date
        workHours.sort((a, b) => {
            const dateA = new Date(a.date.split('-').reverse().join('-'));
            const dateB = new Date(b.date.split('-').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        });

        // Calculate total worked hours for the month
        const totalWorkedHours = workHours.reduce((total, wh) => total + wh.totalHours, 0);

        // Prepare data for the worksheet
        const data = workHours.map((wh) => ({
            Date: `${getDayOfWeek(wh.date)} ${wh.date}`,
            StartTime: wh.startTime,
            EndTime: wh.endTime,
            TotalHours: wh.totalHours,
        }));

        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet([]);

        // Add a title row
        XLSX.utils.sheet_add_aoa(ws, [[`Report ore lavorate nel mese di ${this.monthNames[month - 1]} anno ${year}`]], { origin: 'A1' });

        // Add an empty row
        XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' });

        // Add column headers with bold formatting
        XLSX.utils.sheet_add_aoa(ws, [['Data', 'Ora di Inizio', 'Ora di Fine', 'Ore Totali']], { origin: 'A3' });

        // Add the data starting from the fourth row
        XLSX.utils.sheet_add_json(ws, data, { origin: 'A4', skipHeader: true });

        // Make the column headers bold
        if (!ws['!ref']) {
            throw new InternalServerErrorException('Worksheet reference not found');
        }
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = ws[XLSX.utils.encode_cell({ r: 2, c: C })];
            if (cell && cell.s) {
                cell.s.font = { bold: true };
            } else if (cell) {
                cell.s = { font: { bold: true } };
            }
        }

        // Add a total worked hours row
        XLSX.utils.sheet_add_aoa(ws, [[`Ore Totali per questo mese: `]], { origin: `A${data.length + 5}` });
        XLSX.utils.sheet_add_aoa(ws, [[`${totalWorkedHours}`]], { origin: `B${data.length + 5}` });
        
        // Create a workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Work Hours");

        // Write the workbook to a buffer
        const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

        return buffer; // Return the buffer (XLSX file)
    }
}

// Helper function to get the day of the week in Italian
function getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return daysOfWeek[date.getDay()];
}

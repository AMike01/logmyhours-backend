/* eslint-disable */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WorkHoursService } from './work-hours.service';
import { User } from 'src/auth/types/auth';
import { CreateWorkHoursDto } from './dto/create-work-hour.dto';
import { UserInfo } from 'src/auth/decorators/user-info.decorator';
import { WorkHour } from './schemas/work-hours.schema';
import { UpdateWorkHourDto } from './dto/update-work.hour.dto';
import { CreateWeekWorkHoursDto } from './dto/create-week-work-hours.dto';
import { UpdateWeekWorkHourDto } from './dto/update-week-work-hours.dto';

@Controller('work-hours')
export class WorkHoursController {
    constructor(private readonly workHoursService: WorkHoursService) {}

    @Post()
    async create(
        @UserInfo() user: User,
        @Body() createWorkHourDto: CreateWorkHoursDto,
    ): Promise<void> {
        createWorkHourDto.userEmail = user.email;
        await this.workHoursService.create(createWorkHourDto);
    }

    @Post('week')
    async createWeek(
        @UserInfo() user: User,
        @Body() createWeekWorkHoursDto: CreateWeekWorkHoursDto
    ): Promise<void> {
        createWeekWorkHoursDto.workHours.forEach(async (workHour) => {
            workHour.userEmail = user.email;
            await this.workHoursService.create(workHour);
        });
    }

    @Get()
    async findAll(
        @UserInfo() user: User
    ): Promise<WorkHour[]> {
        const WorkHour: WorkHour[] = await this.workHoursService.findAll(user);

        if(!WorkHour) 
            throw new Error('Work hours not found');

        return WorkHour;
    }

    @Put()
    async update(
        @UserInfo() user: User,
        @Body() updateWorkHourDto: UpdateWorkHourDto
    ): Promise<void> {
        updateWorkHourDto.userEmail = user.email;
        await this.workHoursService.update(updateWorkHourDto);
    }

    @Put('week')
    async updateWeek(
        @UserInfo() user: User,
        @Body() updateWeekWorkHourDto: UpdateWeekWorkHourDto
    ): Promise<void> {
        updateWeekWorkHourDto.workHours.forEach(async (workHour) => {
            workHour.userEmail = user.email;
            await this.workHoursService.update(workHour);
        });
    }

    @Delete(':date')
    async delete(
        @UserInfo() user: User,
        @Param('date') date: string,
    ): Promise<void> {
        await this.workHoursService.delete(date, user.email);
    }
}
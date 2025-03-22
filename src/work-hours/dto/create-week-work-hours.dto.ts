/* eslint-disable */
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkHoursDto } from './create-work-hour.dto';

export class CreateWeekWorkHoursDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateWorkHoursDto)
    workHours: CreateWorkHoursDto[];
}
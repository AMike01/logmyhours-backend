/* eslint-disable */
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateWorkHourDto } from './update-work.hour.dto';

export class UpdateWeekWorkHourDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateWorkHourDto)
    workHours: UpdateWorkHourDto[];
}
/* eslint-disable */
import { IsOptional, IsString, IsDateString, IsEmail, IsNotEmpty, Matches, IsNumber } from 'class-validator';

export class UpdateWorkHourDto {
    @IsNotEmpty()
    @IsEmail()
    userEmail?: string; // User email
    
    @IsNotEmpty()
    @IsString()
    @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: "Date must be in DD-MM-YYYY format" })
    date: string; // Work date (DD-MM-YYYY)

    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsDateString()
    endTime: string;

    @IsOptional()
    @IsNumber()
    totalHours?: number;
}
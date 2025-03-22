/* eslint-disable */
import { IsNotEmpty, IsString, Matches, IsNumber, Min, IsEmail } from "class-validator";

export class CreateWorkHoursDto {
  @IsNotEmpty()
  @IsEmail()
  userEmail?: string; // User email

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: "Date must be in DD-MM-YYYY format" })
  date: string; // Work date (DD-MM-YYYY)

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "Start time must be in HH:mm format" })
  startTime: string; // Start time (HH:mm)

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "End time must be in HH:mm format" })
  endTime: string; // End time (HH:mm)

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: "Total hours must be a positive number" })
  totalHours?: number; // Total hours worked (calculated)
}

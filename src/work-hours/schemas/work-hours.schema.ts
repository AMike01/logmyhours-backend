/* eslint-disable */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true }) // Adds createdAt & updatedAt fields
export class WorkHour extends Document {
  @Prop({ type: String, required: true })
  userEmail: string;

@Prop({ required: true, match: /^\d{2}-\d{2}-\d{4}$/ }) 
date: string; // Date in "DD-MM-YYYY" format

  @Prop({ required: true })
  startTime: string; // Start time (HH:mm)

  @Prop({ required: true })
  endTime: string; // End time (HH:mm)

  @Prop({ required: true, min: 0 })
  totalHours: number; // Total hours worked (calculated)
}

export const WorkHourSchema = SchemaFactory.createForClass(WorkHour);

  
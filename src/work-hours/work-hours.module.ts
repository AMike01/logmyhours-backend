/* eslint-disable */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkHoursService } from "./work-hours.service";
import { WorkHoursController } from "./work-hours.controller";
import { WorkHour, WorkHourSchema } from "./schemas/work-hours.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkHour.name, schema: WorkHourSchema }])],
  controllers: [WorkHoursController],
  providers: [WorkHoursService],
  exports: [WorkHoursService], // Allows use in other modules
})
export class WorkHoursModule {}

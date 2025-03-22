/* eslint-disable */
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guards/role.guard';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkHoursModule } from './work-hours/work-hours.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/hours_db'),
    AuthModule,
    WorkHoursModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}

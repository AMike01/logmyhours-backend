/* eslint-disable */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkHour } from './schemas/work-hours.schema';
import { CreateWorkHoursDto } from './dto/create-work-hour.dto';
import { User } from 'src/auth/types/auth';
import { UpdateWorkHourDto } from './dto/update-work.hour.dto';
import { calculateTotalTime, startTimeBeforeEndTime } from './work-hours.helper';

@Injectable()
export class WorkHoursService {
    constructor(
        @InjectModel(WorkHour.name)
        private readonly workHourModel: Model<WorkHour>
    ) { }

    async create(createWorkHourDto: CreateWorkHoursDto) {

        // Check if work hour already exists for the given date
        const existingWorkHour = await this.workHourModel.findOne({
            date: createWorkHourDto.date,
            userEmail: createWorkHourDto.userEmail,
        }).exec();

        // If work hour already exists, throw an error
        if (existingWorkHour) {
            throw new ConflictException(`L\'ora di lavoro per la data ${createWorkHourDto.date} esiste già`);
        }

        // If start time is after end time, throw an error
        if (!startTimeBeforeEndTime(createWorkHourDto.startTime, createWorkHourDto.endTime)) {
            throw new BadRequestException('L\'orario di inizio deve essere precedente all\'orario di fine');
        }

        // Calculate total hours for the day
        const totalTime = calculateTotalTime(createWorkHourDto.startTime, createWorkHourDto.endTime);
        createWorkHourDto.totalHours = totalTime;

        // Create work hour
        const createdWorkHour =
            await this.workHourModel.create(createWorkHourDto);

        if (!createdWorkHour) {
            throw new InternalServerErrorException('Errore durante la creazione dell\'orario di lavoro');
        }

        return createdWorkHour;
    }

    async findAll(user: User): Promise<WorkHour[]> {
        const WorkHour = this.workHourModel
            .find({ userEmail: user.email })
            .exec();

        if (!WorkHour) {
            throw new InternalServerErrorException('Non è stato possibile recuperare gli orari di lavoro');
        }

        return WorkHour;
    }

    async findByMonthAndYear(user: User, month: number, year: number): Promise<WorkHour[]> {
        const workHours = await this.workHourModel.find({
            userEmail: user.email,
            date: {
                $regex: new RegExp(`^\\d{2}-${('0' + month).slice(-2)}-${year}$`)
            }
        }).exec();

        if (!workHours) {
            throw new InternalServerErrorException('Non è stato possibile recuperare gli orari di lavoro per il mese e l\'anno specificati');
        }

        return workHours;
    }

    async update(updateWorkHourDto: UpdateWorkHourDto): Promise<WorkHour> {
        // Check if work hour exists
        const existingWorkHour = await this.workHourModel.findOne({
            date: updateWorkHourDto.date,
            userEmail: updateWorkHourDto.userEmail,
        }).exec();

        // If work hour does not exist, throw an error
        if (!existingWorkHour) {
            throw new BadRequestException(`L\'orario di lavoro per la data ${updateWorkHourDto.date} non esiste`);
        }

        // If start time is after end time, throw an error
        if (!startTimeBeforeEndTime(updateWorkHourDto.startTime, updateWorkHourDto.endTime)) {
            throw new BadRequestException('L\'orario di inizio deve essere precedente all\'orario di fine');
        }

        // Calculate total hours for the day
        const totalTime = calculateTotalTime(updateWorkHourDto.startTime, updateWorkHourDto.endTime);
        updateWorkHourDto.totalHours = totalTime;

        // Update work hour
        const updatedWorkHour = await this.workHourModel
            .findOneAndUpdate(
                { date: updateWorkHourDto.date, userEmail: updateWorkHourDto.userEmail },
                updateWorkHourDto,
                { new: true }
            )
            .exec();

        if (!updatedWorkHour) {
            throw new InternalServerErrorException('Errore durante l\'aggiornamento dell\'orario di lavoro');
        }

        return updatedWorkHour;
    }

    async delete(date: string, userEmail: string): Promise<void> {
        // Check if work hour exists
        const existingWorkHour = await this.workHourModel.findOne({
            date,
            userEmail,
        }).exec();

        // If work hour does not exist, throw an error
        if (!existingWorkHour) {
            throw new BadRequestException('L\'orario di lavoro per questa data non esiste');
        }

        // Delete work hour
        const deletedWorkHour = await this.workHourModel
            .findOneAndDelete({
                date,
                userEmail,
            })
            .exec();
        
        if (!deletedWorkHour) {
            throw new InternalServerErrorException('Errore durante l\'eliminazione dell\'orario di lavoro');
        }

        return;
    }
}
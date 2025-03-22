/* eslint-disable */
import { BadRequestException } from "@nestjs/common";

export function calculateTotalTime(startTime: string, endTime: string): number {

    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeFormat.test(startTime) || !timeFormat.test(endTime)) {
        throw new BadRequestException('Il formato dell\'orario deve essere HH:mm');
    }

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    const totalTime = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // convert milliseconds to hours

    return totalTime;
}

export function startTimeBeforeEndTime(startTime: string, endTime: string): boolean {

    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeFormat.test(startTime) || !timeFormat.test(endTime)) {
        throw new BadRequestException('Il formato dell\'orario deve essere HH:mm');
    }

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    return startHours < endHours || (startHours === endHours && startMinutes < endMinutes);
}
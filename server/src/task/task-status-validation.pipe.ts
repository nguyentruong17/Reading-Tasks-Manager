import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses: string[] = [
        ...Object.values(TaskStatus)
    ]
    
    transform(value: string, metadata: ArgumentMetadata) {
        //console.log('Value: ', value);
        //console.log('Metadata: ', metadata);
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`Invalid Status. Status must be one of ${this.allowedStatuses}`)
        }
        return value;
    }

    private isStatusValid(status: string) {
        return this.allowedStatuses.includes(status);
    } 
}
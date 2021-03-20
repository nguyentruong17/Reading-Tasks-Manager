import { IsDateString, IsString } from "class-validator"
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, GraphQLISODateTime } from "@nestjs/graphql";

@Schema()
@ObjectType()
export class TaskHistory {
    
    @IsDateString()
    @Prop({ required: true, type: () => String })
    @Field((type) => GraphQLISODateTime)
    createdAt: string
    
    @IsString()
    @Prop({ required: true, type: () => String })
    @Field((type) => String)
    description: string
}

export const TaskHistorySchema = SchemaFactory.createForClass(TaskHistory);
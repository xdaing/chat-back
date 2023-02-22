import { IsString, IsDateString, IsNotEmpty, IsBoolean, IsEnum, MaxLength } from 'class-validator'
import { MessageType } from '@/types'

export class CreatePersonalMessage {

    @IsNotEmpty()
    @IsString()
    readonly from: string

    @IsNotEmpty()
    @IsString()
    readonly to: string

    @IsNotEmpty()
    @IsEnum(MessageType)
    readonly messageType: MessageType

    @IsNotEmpty()
    @IsDateString()
    readonly time: Date

    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    readonly content: string

    @IsNotEmpty()
    @IsBoolean()
    readonly isImage: boolean
}
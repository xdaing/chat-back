import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { MessageType } from '@/types'

export type VisitorMessageDocument = HydratedDocument<VisitorMessage>

@Schema()
export class VisitorMessage {

    @Prop({ required: true })
    from: string  // 游客身份 (nanoid生成)

    @Prop({ required: true })
    name: string

    @Prop({ required: true, enum: MessageType })
    messageType: MessageType

    @Prop({ default: Date.now })
    time: Date

    @Prop({ required: true })
    isImage: boolean

    @Prop({ required: true, maxlength: 60 })
    content: string

    @Prop({ required: true })
    avatar: string
}

export const VisitorMessageSchema = SchemaFactory.createForClass(VisitorMessage)
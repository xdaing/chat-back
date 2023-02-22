import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { HydratedDocument } from 'mongoose'
import { MessageType } from '@/types'

export type PersonalMessageDocument = HydratedDocument<PersonalMessage>

@Schema()
export class PersonalMessage {

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    from: string // 发送人 _id

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    to: string // 接收人 _id

    @Prop({ required: true, enum: MessageType })
    messageType: MessageType

    @Prop({ default: Date.now })
    time: Date

    @Prop({ required: true, maxlength: 60 })
    content: String

    @Prop({ required: true })
    isImage: boolean
}
export const PersonalMessageSchema = SchemaFactory.createForClass(PersonalMessage)
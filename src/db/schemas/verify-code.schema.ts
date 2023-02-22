import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type VerifyCodeDocument = HydratedDocument<VerifyCode>

@Schema()
export class VerifyCode {

    @Prop({ required: true })
    email: string

    @Prop({ length: 6, required: true })
    code: string

    @Prop({ default: Date.now })
    create: Date
}
export const VerifyCodeSchema = SchemaFactory.createForClass(VerifyCode)

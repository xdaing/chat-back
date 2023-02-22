import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'
import { PersonalMessage, PersonalMessageSchema } from './schemas/personal-message.schema'
import { VisitorMessage, VisitorMessageSchema } from './schemas/visitor-message.schema'
import { VerifyCode, VerifyCodeSchema } from './schemas/verify-code.schema'

const Connection = MongooseModule.forRoot('mongodb://127.0.0.1/nestChat')

const Modules = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema },
    { name: PersonalMessage.name, schema: PersonalMessageSchema },
    { name: VisitorMessage.name, schema: VisitorMessageSchema },
    { name: VerifyCode.name, schema: VerifyCodeSchema }
])

@Module({
    imports: [Connection, Modules],
    exports: [Modules]
})
export class DbModule { }
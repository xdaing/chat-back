import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './schemas/user.schema'


const Connection = MongooseModule.forRoot('mongodb://localhost/nestChat')
const Modules = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
])

@Module({
    imports: [Connection, Modules],
    exports: [Modules]
})
export class DbModule { }

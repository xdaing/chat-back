import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Schema as RawSchema } from 'mongoose'
import { hashSync } from 'bcryptjs'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {

    _id: string

    @Prop()
    account: string // 账号

    @Prop()
    name: string //名称

    @Prop({ set: (password: string) => hashSync(password, 10) })
    password: string // 密码

    @Prop()
    signature: string // 签名

    @Prop()
    sex: string // 性别

    @Prop()
    age: number

    @Prop()
    avatar: string // 头像

    @Prop({ type: [{ remark: String, friend: { type: RawSchema.Types.ObjectId, ref: 'User' }, unread: Number }] })
    friends: Array<{ remark: string, friend: User, unread: number }> // 好友

    @Prop({ default: Date.now })
    createTime: Date

    @Prop({ default: false })
    isForbid: boolean

    @Prop()
    level: number // 权限等级
}
export const UserSchema = SchemaFactory.createForClass(User)
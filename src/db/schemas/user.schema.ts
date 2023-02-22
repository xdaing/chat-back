import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Schema as MongooseSchema } from 'mongoose'
import { hashSync } from 'bcryptjs'
import { nanoid } from 'nanoid'
import { ContactsItem } from '@/types'

export type UserDocument = HydratedDocument<User>

const emailReg: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Schema()
export class User {

    _id: string

    @Prop({ required: true, unique: true, match: emailReg })
    email: string // 账号

    @Prop({ maxlength: 6, default: () => `用户${nanoid(4)}` })
    name: string //名称

    @Prop({ required: true, set: (password: string) => hashSync(password, 10) })
    password: string // 密码

    @Prop({ maxlength: 20, default: '这个人什么也没有留下！' })
    signature: string // 签名

    @Prop({ default: '/public/user/avatar/default.png' })
    avatar: string // 头像

    @Prop({
        type: [{
            remark: { type: String, default: '' },
            contact: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
            unread: { type: Number, default: 1 },
            onList: { type: Boolean, default: true } // 消息列表是否展示
        }]
    })
    contacts: Array<ContactsItem> // 联系人

    @Prop({ default: Date.now })
    create: Date // 注册时间

    @Prop({ type: [MongooseSchema.Types.ObjectId] })
    applications: Array<string> // 申请列表
}
export const UserSchema = SchemaFactory.createForClass(User)
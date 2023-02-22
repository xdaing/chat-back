import { Request } from '@nestjs/common'
import { User } from '@/db/schemas/user.schema'
import { PersonalMessage } from '@/db/schemas/personal-message.schema'

export interface ContactsItem {
    remark: string
    contact: User
    unread: number
    received: number
    messages: Array<PersonalMessage>
    onList: boolean
}

export type JwtRequest = Request & { user: Payload }

export enum MessageType {
    Group = 'group',
    Personal = 'personal',
    System = 'system',
    Contact = 'contact'
}

export enum VerifyCodeResult {
    Success = '验证通过',
    Expire = '验证码失效',
    Error = '验证码错误'
}
export interface Payload {
    readonly email: string
    readonly _id: string
}

export enum UserSocketEvent {
    Init = 'user-init', // 用户初始化
    PersonalMessage = 'user-personal-message', // 私聊消息
    GroupMessage = 'user-group-message', // 群聊消息
    ApplyContact = 'user-apply-contact', // 申请添加新联系人
    AddContact = 'user-add-contact', // 添加新联系人
    Refresh = 'user-refresh-token'
}

export enum VisitorSocketEvent {
    Init = 'visitor-init', // 游客初始化链接
    Message = 'visitor-message', // 游客消息
    Online = 'visitor-online'
}

export enum SocketNameSpace {
    User = 'user',
    Visitor = 'visitor'
}
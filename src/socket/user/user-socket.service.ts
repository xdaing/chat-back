import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PersonalMessage, PersonalMessageDocument } from '@/db/schemas/personal-message.schema'
import { Model } from 'mongoose'
import { UserService } from '@/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { Socket } from 'socket.io'
import { Payload, UserSocketEvent, ContactsItem, MessageType } from '@/types'
import { User } from '@/db/schemas/user.schema'
import { TokenExpiredError } from 'jsonwebtoken'
import { CreatePersonalMessage } from './dto'

@Injectable()
export class UserSocketService {
  private readonly onlineSockets: Map<string, Socket> = new Map() // 在线用户

  constructor(
    @InjectModel(PersonalMessage.name) private readonly personalMessageModel: Model<PersonalMessageDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async handleConnection(client: Socket) {
    console.log('用户登录');
    const { access_token, refresh_token } = client.handshake.auth

    try {
      const payload: Payload = this.jwtService.verify(access_token)
      this.loginInit(payload._id, client)
    } catch {
      try {
        const payload: Payload = this.jwtService.verify(refresh_token)
        const { email, _id } = payload
        const token = this.jwtService.sign({ email, _id }, { expiresIn: '7d', issuer: 'access' })
        client.emit(UserSocketEvent.Refresh, token)
        this.loginInit(_id, client)
      } catch {
        client.emit('error', { statusCode: 500, message: '登录出错' })
        client.disconnect()
      }
    }
  }

  handleDisconnect(client: Socket) {
    const _id: string = client.handshake.auth._id
    this.onlineSockets.delete(_id)
    console.log('用户断开')
  }

  async loginInit(_id: string, client: Socket) {
    try {
      const isIdExist: boolean = await this.userService.isIdExist(_id)
      if (!isIdExist) throw new Error('用户不存在')
      if (this.onlineSockets.has(_id)) {
        client.emit('error', { statusCode: 600, message: '重复登录' })
        client.disconnect()
      } else {
        this.onlineSockets.set(_id, client)
        client.handshake.auth._id = _id
        const user: User = await this.userService.loginInit(_id)
        for (let i: number = 0, length: number = user.contacts.length; i < length; i++) {
          const item: ContactsItem = user.contacts[i]
          item.messages = await this.query(_id, item.contact._id, 0)
        }
        client.emit(UserSocketEvent.Init, user)
      }
    } catch {
      client.emit('error', { statusCode: 500, message: '登录出错' })
      client.disconnect()
    }
  }

  query(_id: string, contactId: string, page: number, received: number = 0, limit: number = 20) {
    return this.personalMessageModel.find({
      $or: [{ from: _id, to: contactId }, { from: contactId, to: _id }]
    }).sort('-time').skip(page * limit + received).limit(limit).lean()
  }

  // !
  // 申请添加好友
  async applyContact(toId: string, client: Socket) {
    const { _id } = client.handshake.auth
    // 存储申请
    await this.userService.addApply(toId, _id)
    const toClient: Socket | undefined = this.onlineSockets.get(toId)
    // 对方在线通知对方
    if (toClient !== undefined) toClient.emit(UserSocketEvent.ApplyContact, _id)
    return true
  }

  // 添加好友
  async addContact(applyId: string, client: Socket) {
    const _id: string = client.handshake.auth._id
    await this.userService.addContact(_id, applyId)
    const personalMessage: PersonalMessage = await this.personalMessageModel.create({
      from: applyId,
      to: _id,
      content: '成功添加好友',
      isImage: false,
      time: new Date(),
      messageType: MessageType.System
    })
    const messages: Array<PersonalMessage> = [personalMessage]
    const applyClient: Socket | undefined = this.onlineSockets.get(applyId)
    if (applyClient !== undefined) {
      const item: ContactsItem = await this.userService.contactInfo(applyId, _id)
      item.messages = messages
      applyClient.emit(UserSocketEvent.AddContact, item)
    }
    const item: ContactsItem = await this.userService.contactInfo(applyId, _id)
    item.messages = messages
    return item
  }

  async personalMessage(createPersonalMessage: CreatePersonalMessage, client: Socket) {
    const { from, to } = createPersonalMessage
    const _id: string = client.handshake.auth._id
    const isExist: boolean = await this.userService.isIdExist(to)
    if (!isExist || from !== _id) throw new Error()
    const personalMessage: PersonalMessage = await this.personalMessageModel.create(createPersonalMessage)
    const toClient: Socket | undefined = this.onlineSockets.get(to)
    if (toClient === undefined) {
      await this.userService.addUnread(to, from)
    } else toClient.emit(UserSocketEvent.PersonalMessage, personalMessage)
    return personalMessage
  }
}
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Socket, Server } from 'socket.io'
import { VisitorMessage, VisitorMessageDocument } from '@/db/schemas/visitor-message.schema'
import { VisitorSocketEvent } from '@/types'
import { CreateVisitorMessage } from './dto'

const room: string = 'visitor-room'

@Injectable()
export class VisitorSocketService {
  private onlineSockets: number = 0
  constructor(@InjectModel(VisitorMessage.name) private readonly visitorMessageModel: Model<VisitorMessageDocument>) { }

  async handleConnection(client: Socket, server: Server) {
    try {
      client.join(room)
      const messages: Array<VisitorMessage> = await this.query(0)
      client.emit(VisitorSocketEvent.Init, messages)
      server.to(room).emit(VisitorSocketEvent.Online, ++this.onlineSockets)
    } catch {
      client.emit('error', { statusCode: 400, message: '出错了' })
      client.disconnect()
      client.broadcast.to(room).emit(VisitorSocketEvent.Online, this.reduce())
    }
  }

  handleDisconnect(client: Socket) {
    client.broadcast.to(room).emit(VisitorSocketEvent.Online, this.reduce())
    client.leave(room)
  }

  reduce() {
    return this.onlineSockets === 0 ? 0 : --this.onlineSockets
  }

  async send(createVisitorMessage: CreateVisitorMessage, client: Socket) {
    const visitorMessage: VisitorMessage = await this.visitorMessageModel.create(createVisitorMessage)
    client.broadcast.to(room).emit(VisitorSocketEvent.Message, visitorMessage)
    return visitorMessage
  }

  async query(page: number, received: number = 0, limit: number = 20) {
    return this.visitorMessageModel.find().sort('-time').skip(page * limit + received).limit(limit).lean()
  }
}

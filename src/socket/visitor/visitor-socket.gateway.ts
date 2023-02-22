import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { UseFilters, ValidationPipe, UsePipes } from '@nestjs/common'
import { VisitorSocketEvent, SocketNameSpace } from '@/types'
import { WsExceptionFilter } from '@/filters/ws-exception.filter'
import { VisitorSocketService } from './visitor-socket.service'
import { CreateVisitorMessage } from './dto'

@UseFilters(WsExceptionFilter)
@WebSocketGateway({ namespace: SocketNameSpace.Visitor })
export class VisitorSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() private readonly server: Server

  constructor(private readonly visitorSocketService: VisitorSocketService) { }

  handleConnection(client: Socket) {
    return this.visitorSocketService.handleConnection(client, this.server)
  }

  handleDisconnect(client: Socket) {
    return this.visitorSocketService.handleDisconnect(client)
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage(VisitorSocketEvent.Message)
  async send(@MessageBody() createVisitorMessage: CreateVisitorMessage, @ConnectedSocket() client: Socket) {
    return this.visitorSocketService.send(createVisitorMessage, client)
  }
}

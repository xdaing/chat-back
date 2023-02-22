import { WebSocketGateway, SubscribeMessage, ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets'
import { UseFilters, ValidationPipe, UsePipes } from '@nestjs/common'
import { Socket, } from 'socket.io'
import { UserSocketService } from './user-socket.service'
import { CreatePersonalMessage } from './dto'
import { UserSocketEvent, SocketNameSpace } from '@/types'
import { WsExceptionFilter } from '@/filters/ws-exception.filter'
import { IsUserIdPipe } from '@/pipes/user.pipe'
import { WsJwtVerify } from '@/decorators/wsJwt-verify.decorator'

@WsJwtVerify()
@UseFilters(WsExceptionFilter) // 异常处理
@WebSocketGateway({ namespace: SocketNameSpace.User })
export class UserSocketUserGateway implements OnGatewayConnection, OnGatewayDisconnect {


  constructor(private readonly userSocketService: UserSocketService) { }

  async handleConnection(client: Socket) {
    return this.userSocketService.handleConnection(client)
  }

  handleDisconnect(client: Socket) {
    return this.userSocketService.handleDisconnect(client)
  }

  @UsePipes(ValidationPipe) // 发送消息
  @SubscribeMessage(UserSocketEvent.PersonalMessage)
  personalMessage(@MessageBody() createMessage: CreatePersonalMessage, @ConnectedSocket() client: Socket) {
    return this.userSocketService.personalMessage(createMessage, client)
  }

  @SubscribeMessage(UserSocketEvent.ApplyContact)  // 申请添加好友
  applyContact(@MessageBody(IsUserIdPipe) toId: string, @ConnectedSocket() client: Socket) {
    return this.userSocketService.applyContact(toId, client)
  }

  @SubscribeMessage(UserSocketEvent.AddContact)   // 添加好友
  addContact(@MessageBody(IsUserIdPipe) applyId: string, @ConnectedSocket() client: Socket) {
    return this.userSocketService.addContact(applyId, client)
  }
}

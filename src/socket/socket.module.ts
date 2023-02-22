import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { UserModule } from '@/user/user.module'
import { JwtModule } from '@/jwt/jwt.module'
import { UserSocketUserGateway } from './user/user-socket.gateway'
import { UserSocketService } from './user/user-socket.service'
import { VisitorSocketGateway } from './visitor/visitor-socket.gateway'
import { VisitorSocketService } from './visitor/visitor-socket.service'


@Module({
  imports: [DbModule, UserModule, JwtModule],
  providers: [UserSocketUserGateway, VisitorSocketGateway, UserSocketService, VisitorSocketService]
})

export class SocketModule { }

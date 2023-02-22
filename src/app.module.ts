import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { SocketModule } from '@/socket/socket.module'
import { UserModule } from '@/user/user.module'
import { JwtModule } from '@/jwt/jwt.module'
import { FileModule } from '@/file/file.module'
import { StaticModule } from '@/static/static.module'

@Module({
  imports: [SocketModule, UserModule, ThrottlerModule.forRoot({ ttl: 60, limit: 100 }), JwtModule, FileModule, StaticModule],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})

export class AppModule { }

import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { ConfigModule } from '@/config/config.module'
import { EmailModule } from '@/email/email.module'
import { HttpJwtStrategy } from '@/guards/auth/http-jwt.strategy'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { JwtModule } from '@/jwt/jwt.module'

@Module({
    imports: [DbModule, JwtModule, ConfigModule, EmailModule],
    controllers: [UserController],
    providers: [UserService, HttpJwtStrategy],
    exports: [UserService]
})

export class UserModule { }

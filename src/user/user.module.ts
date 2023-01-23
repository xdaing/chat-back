import { Module } from '@nestjs/common'
import { DbModule } from '@/db/db.module'
import { JwtModule as JWT } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpJwtStrategy } from '@/guards/auth/http-jwt.strategy'
import { UserController } from './user.controller'
import { UserService } from './user.service'

const JwtModule = JWT.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory(configService: ConfigService) {
        return {
            secret: configService.get('SecretKey'),
            signOptions: { expiresIn: '7d' }
        }
    }
})

@Module({
    imports: [DbModule, JwtModule, ConfigModule.forRoot()],
    controllers: [UserController],
    providers: [UserService, HttpJwtStrategy]
})

export class UserModule { }

import { DynamicModule } from '@nestjs/common'
import { JwtModule as JWT } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@/config/config.module'

export const JwtModule: DynamicModule = JWT.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        secret: configService.get('SecretKey')
    })
})

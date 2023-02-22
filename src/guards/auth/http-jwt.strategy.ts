import { Injectable, BadRequestException } from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Payload } from '@/types'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@/user/user.service'


@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token'),
            ignoreExpiration: false,
            secretOrKey: configService.get('SecretKey')
        })
    }

    async validate(payload: Payload): Promise<Payload> {
        const isExist: boolean = await this.userService.isIdExist(payload._id)
        if (!isExist) throw new BadRequestException('用户不存在')
        return payload
    }
}
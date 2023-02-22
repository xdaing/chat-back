import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@/user/user.service'
import { Payload, UserSocketEvent } from '@/types'

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }
    async canActivate(context: ExecutionContext) {
        const client: Socket = context.switchToWs().getClient()
        const { access_token, refresh_token } = client.handshake.auth
        try {
            this.jwtService.verify(access_token)
        } catch {
            const payload: Payload = this.jwtService.verify(refresh_token)
            const { email, _id } = payload
            const token = this.jwtService.sign({ email, _id }, { expiresIn: '7d', issuer: 'access' })
            client.emit(UserSocketEvent.Refresh, token)
            client.handshake.auth.access_token = token
        }
        return true
    }
}
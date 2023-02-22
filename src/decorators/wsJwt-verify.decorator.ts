import { applyDecorators, UseGuards } from '@nestjs/common'
import { WsJwtGuard } from '@/guards/auth/ws-jwt.guard'

export function WsJwtVerify() {
    return applyDecorators(UseGuards(WsJwtGuard))
}
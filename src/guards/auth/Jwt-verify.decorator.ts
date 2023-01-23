import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * @description: jwt 验证装饰器
 * @Author: 咩咩
 */
export function JwtVerify() {
    return applyDecorators(UseGuards(AuthGuard('jwt')))
}
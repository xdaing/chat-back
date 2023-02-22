import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export function HttpJwtVerify() {
    return applyDecorators(UseGuards(AuthGuard('jwt')))
}
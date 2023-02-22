import { Catch, ArgumentsHost } from '@nestjs/common'
import { Socket } from 'socket.io'
import { JsonWebTokenError } from 'jsonwebtoken'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    async catch(exception: Error, host: ArgumentsHost) {
        super.catch(exception, host)
    }
    handleError<TClient extends { emit: Function }>(client: TClient, exception: Error): void {
        if (exception instanceof JsonWebTokenError) {
            client.emit('error', { statusCode: 500, message: '登录出错' })
        } else client.emit('error', { statusCode: 400, message: exception.message })
    }
}
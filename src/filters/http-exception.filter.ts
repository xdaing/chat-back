import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch() // 处理所有错误
export class HttpExceptionsFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>()
        const status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR
        if (status === 401) response.json({ statusCode: status })
        else {
            response.status(status).json({
                message: exception.message,
                statusCode: status
            })
        }
    }
}

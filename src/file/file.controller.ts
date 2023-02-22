import { Controller, Post, UploadedFile, UseInterceptors, UseFilters } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { HttpJwtVerify } from '@/decorators/httpJwt-verify.decorator'
import { HttpExceptionsFilter } from '@/filters/http-exception.filter'
import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { setFileOptions } from './file-options'


@UseInterceptors(TransformInterceptor)
@UseFilters(HttpExceptionsFilter)
@Controller('file')
export class FileController {

    @Post('visitor')
    @UseInterceptors(FileInterceptor('file', setFileOptions('../public/visitor')))
    visitorImage(@UploadedFile() file: Express.Multer.File) {
        return `/visitor/${file.filename}`
    }

    @HttpJwtVerify()
    @Post('user')
    @UseInterceptors(FileInterceptor('file', setFileOptions('../public/user')))
    userImage(@UploadedFile() file: Express.Multer.File) {
        return `/user/${file.filename}`
    }
}

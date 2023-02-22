import { UnsupportedMediaTypeException } from '@nestjs/common'
import { MulterModuleOptions } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { nanoid } from 'nanoid'

export const setFileOptions = (path: string): MulterModuleOptions => ({
    storage: diskStorage({
        destination: join(__dirname, path),
        filename: (_, file, callback) => {
            const fileName = `${nanoid() + extname(file.originalname)}`
            return callback(null, fileName)
        }
    }),
    limits: { fileSize: 2097152 },
    fileFilter(_, file, callback) {
        if (['image/jpeg', 'image/jpg'].includes(file.mimetype)) callback(null, true)
        else callback(new UnsupportedMediaTypeException('图片类型错误'), false)
    }
})
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class IsEmailPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): string {
        const isEmail: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (metadata.metatype === String && isEmail.test(value)) return value
        else throw new BadRequestException('邮箱格式错误')
    }
}

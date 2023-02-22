import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { UserService } from '@/user/user.service'

@Injectable()
export class IsUserIdPipe implements PipeTransform {
    constructor(private readonly userService: UserService) { }
    async transform(value: any, metadata: ArgumentMetadata) {
        const isIdExist: boolean = await this.userService.isIdExist(value)
        if (metadata.metatype === String && isIdExist) return value
        else throw new BadRequestException('用户不存在')
    }
}
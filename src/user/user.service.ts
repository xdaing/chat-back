import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '@/db/schemas/user.schema'
import { Payload } from '@/types'
import { CreateUserDto } from './dto'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async register(createUserDto: CreateUserDto): Promise<Pick<User, 'account'>> {
        const isExist: boolean = await this.isUserExist(createUserDto.account)
        if (isExist) throw new BadRequestException('账号已存在')
        const user: User = await this.userModel.create(createUserDto)
        return { account: user.account }
    }

    async login(account: string, password: string): Promise<string> {
        const user: User | null = await this.findByAccount(account)
        if (user === null) throw new BadRequestException('账号不存在')
        const isOk: boolean = await compare(password, user.password)
        if (!isOk) throw new BadRequestException('密码错误')
        const payload: Payload = { account: user.account, _id: user._id }
        // 登录验证成功，生成 token 返回
        return this.jwtService.sign(payload)
    }

    async isUserExist(account: string): Promise<boolean> {
        const count: number = await this.userModel.count({ account })
        return !(count === 0)
    }

    findByAccount(account: string) {
        return this.userModel.findOne({ account })
    }
}

import { Controller, Get, Post, Body, Query, UsePipes, ValidationPipe, Req, Request } from '@nestjs/common'
import { JwtVerify } from '@/guards/auth/Jwt-verify.decorator'
import { UserService } from './user.service'
import { CreateUserDto, UserLoginDto } from './dto'

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post() // 注册账号
    @UsePipes(new ValidationPipe()) // 验证参数
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto)
    }

    @Post('login') // 登录
    @UsePipes(new ValidationPipe())
    login(@Body() userLoginDto: UserLoginDto) {
        const { account, password } = userLoginDto
        return this.userService.login(account, password)
    }

    @JwtVerify()
    @Get() // 搜索账号
    search(@Query('account') account: string, @Req() req: Request) {

    }
}

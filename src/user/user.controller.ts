import { Controller, Get, Post, Body, Query, UsePipes, ValidationPipe, Req, UseFilters, UseInterceptors, Put } from '@nestjs/common'
import { HttpJwtVerify } from '@/decorators/httpJwt-verify.decorator'
import { UserService } from './user.service'
import { UserRegister, UserLogin, ApplicationData } from './dto'
import { IsEmailPipe } from '@/pipes/email.pipe'
import { Throttle } from '@nestjs/throttler'
import { HttpExceptionsFilter } from '@/filters/http-exception.filter'
import { TransformInterceptor } from '@/interceptors/transform.interceptor'
import { Payload, JwtRequest } from '@/types'
import { IsUserIdPipe } from '@/pipes/user.pipe'

@UseInterceptors(TransformInterceptor) // 处理响应格式
@UseFilters(HttpExceptionsFilter) // 处理错误
@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @HttpJwtVerify() // !
    @Get() // 搜索用户
    search(@Query('email', IsEmailPipe) email: string) {
        return this.userService.search(email)
    }

    @Post() // 注册 // !
    @UsePipes(ValidationPipe) // 验证参数
    register(@Body() userRegister: UserRegister) {
        return this.userService.register(userRegister)
    }

    @Post('login') // 登录 // !
    @UsePipes(ValidationPipe)
    login(@Body() userLogin: UserLogin) {
        return this.userService.login(userLogin.email, userLogin.password)
    }

    @Get('code') // 获取验证码 // !
    @Throttle(1, 60)
    sendCode(@Query('email', IsEmailPipe) email: string) {
        return this.userService.sendCode(email)
    }

    @HttpJwtVerify()
    @Post('applications') // 查询好友申请列表 // !
    @UsePipes(ValidationPipe)
    applications(@Body() applicationData: ApplicationData) {
        return this.userService.applications(applicationData.applications)
    }

    @HttpJwtVerify()
    @Put('apply') // 忽略好友申请 // !
    ignoreApply(@Body('applyId', IsUserIdPipe) applyId: string, @Req() req: JwtRequest) {
        return this.userService.ignoreApply(req.user._id, applyId)
    }

    @HttpJwtVerify()
    @Get('token') // 刷新 token
    refresh(@Req() req: JwtRequest) {
        return this.userService.refreshToken(req.user)
    }

    @HttpJwtVerify() // 更改备注
    @Put('remark')
    changeRemark(@Body('contact', IsUserIdPipe) contact: string, @Body('remark') remark: string, @Req() req: JwtRequest) {
        return this.userService.changeRemark(req.user._id, contact, remark)
    }

    @HttpJwtVerify()
    @Put('unread')
    clearUnread(@Body('contact', IsUserIdPipe) contact: string, @Req() req: JwtRequest) {
        return this.userService.clearUnread(req.user._id, contact)
    }




    @Post('test')
    s(@Body('applyId') applyId: string, @Body('_id') _id: string) {
        return this.userService.test(_id, applyId)
    }
}

import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { VerifyCode, VerifyCodeDocument } from '@/db/schemas/verify-code.schema'
import { VerifyCodeResult } from '@/types'

@Injectable()
export class EmailService {

    constructor(
        @InjectModel(VerifyCode.name) private readonly verifyCodeModel: Model<VerifyCodeDocument>,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    clearOneCode(email: string) {
        return this.verifyCodeModel.deleteOne({ email }).lean()
    }

    clearTimeoutCode(time: number = 600000) {
        return this.verifyCodeModel.deleteMany({ create: { $lte: Date.now() - time } }).lean()
    }

    async createCode(email: string): Promise<VerifyCode> {
        await this.clearTimeoutCode() // 清空超时的验证码
        await this.clearOneCode(email) // 清除之前的验证码
        const code: string = Math.random().toString().slice(2, 8)
        return this.verifyCodeModel.create({ email, code, create: new Date() })
    }

    async verifyCode(email: string, code: string): Promise<VerifyCodeResult> {
        await this.clearTimeoutCode() // 清空超时的验证码
        const verifyCode: VerifyCode | null = await this.verifyCodeModel.findOne({ email }).lean()
        if (verifyCode === null) return VerifyCodeResult.Expire
        else if (code !== verifyCode.code) return VerifyCodeResult.Error
        else {
            await this.clearOneCode(email)
            return VerifyCodeResult.Success
        }
    }

    // 发送邮件验证码
    async sendCode(email: string): Promise<string> {
        console.log(email);
        const verifyCode: VerifyCode = await this.createCode(email)
        await this.mailerService.sendMail({
            subject: '咩咩验证码',
            to: verifyCode.email,
            from: `咩咩<${this.configService.get('EmailUser')}>`,
            html: `
            <h1>欢迎${verifyCode.email}</h1>
            <h2>验证码为：${verifyCode.code},有效期十分钟</h2>`
        })
        return '验证码已发送'
    }
}

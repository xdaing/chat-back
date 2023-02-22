import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '@/db/schemas/user.schema'
import { Payload, VerifyCodeResult, ContactsItem } from '@/types'
import { UserRegister } from './dto'
import { EmailService } from '@/email/email.service'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) { }

    async register(userRegister: UserRegister) { //! http
        const { email, code } = userRegister // 检验邮箱验证码(验证通过后过后此次验证码销毁)
        const verifyCodeResult: VerifyCodeResult = await this.emailService.verifyCode(email, code)
        if (verifyCodeResult !== VerifyCodeResult.Success) throw new BadRequestException(verifyCodeResult)
        const count: number = await this.userModel.count({ email })
        if (count !== 0) throw new BadRequestException('账号已存在')
        const user: User = await this.userModel.create(userRegister)
        return user.email
    }

    async login(email: string, password: string) { // ! http
        const user: Pick<User, '_id' | 'email' | 'password'> | null = await this.userModel.findOne({ email }).select('email password').lean()
        if (user === null) throw new BadRequestException('账号不存在')
        const isPassword: boolean = await compare(password, user.password)
        if (!isPassword) throw new BadRequestException('密码错误')
        const payload: Payload = { email: user.email, _id: user._id }
        const refresh_token: string = this.jwtService.sign(payload, { expiresIn: '45d', issuer: 'refresh' })
        const access_token: string = this.jwtService.sign(payload, { expiresIn: '7d', issuer: 'access' })
        return { refresh_token, access_token }
    }

    loginInit(_id: string) { // ! ws
        return this.userModel.findById(_id).select('-password -createTime').
            populate('contacts.contact', 'avatar email name signature').lean()
    }

    async isIdExist(_id: string) { // ! all
        const count: number = await this.userModel.count({ _id })
        return !(count === 0)
    }

    sendCode(email: string) { // ! http
        return this.emailService.sendCode(email)
    }

    search(email: string) { // ! http
        return this.userModel.findOne({ email }).select('email name avatar signature').lean()
    }

    async resetPassword(email: string, code: string, password: string) {
        const result: VerifyCodeResult = await this.emailService.verifyCode(email, code)
    }

    applications(applications: Array<string>) { // ! http
        return this.userModel.find({ _id: { $in: applications } }).select('avatar name signature').lean()
    }

    async addApply(_id: string, applyId: string) { // ! ws
        const isContact: boolean = await this.isContact(_id, applyId)
        if (isContact) throw new Error('已经是好友了')
        return this.userModel.updateOne({ _id }, { $addToSet: { applications: applyId } }).lean()
    }

    ignoreApply(_id: string, applyId: string) { // ! http
        return this.userModel.updateOne({ _id }, { $pull: { applications: applyId } }).lean()
    }

    async isContact(user1: string, user2: string) { // 是否已经是联系人 
        const count: number = await this.userModel.count({
            $or: [
                { _id: user1, 'contacts.contact': user2 },
                { _id: user2, 'contacts.contact': user1 }
            ]
        })
        return !(count === 0)
    }

    async addContact(_id: string, applyId: string) { // ! ws
        const isContact: boolean = await this.isContact(_id, applyId)
        if (isContact) throw new Error('已经是好友了')
        await this.userModel.updateOne({ _id }, { $pull: { applications: applyId }, $push: { contacts: { contact: applyId } } }).lean()
        await this.userModel.updateOne({ _id: applyId }, { $push: { contacts: { contact: _id } } }).lean()
    }

    async contactInfo(_id: string, contact: string) { //! ws
        const result: Pick<User, 'contacts'> = await this.userModel.findOne({ _id, 'contacts.contact': contact }).
            select('contacts.$').populate('contacts.contact', 'avatar email name signature').lean()
        return result.contacts[0]
    }

    clearUnread(_id: string, contact: string) {
        return this.userModel.updateOne({ _id, 'contacts.contact': contact }, { $set: { 'contacts.$.unread': 0 } })
    }

    addUnread(_id: string, contact: string) {
        return this.userModel.updateOne({ _id, 'contacts.contact': contact }, { $inc: { 'contacts.$.unread': 1 } })
    }

    changeRemark(_id: string, contact: string, remark: string) {
        return this.userModel.updateOne({ _id, 'contacts.contact': contact }, { $set: { 'contacts.$.remark': remark } })
    }

    async test(_id: string, contact: string) {
        // console.log(_id, applyId);
        // const result0: Pick<User, 'contacts'> = await this.userModel.findOne({ _id, 'contacts.contact': applyId }).
        //     select('contacts.$').populate('contacts.contact', 'avatar email name signature').lean()
        // const result1: Pick<User, 'contacts'> = await this.userModel.findOne({ _id: applyId, 'contacts.contact': _id }).
        //     select('contacts.$').populate('contacts.contact', 'avatar email name signature').lean()
        // return result0.contacts.concat(result1.contacts)
        return this.userModel.updateOne({ _id, 'contacts.contact': contact }, { $inc: { 'contacts.$.unread': 1 } })
    }

    refreshToken(payload: Payload) {
        const { email, _id } = payload
        return this.jwtService.sign({ email, _id }, { expiresIn: '7d', issuer: 'access' })
    }

    changeOnList(_id: string, contact: string, value: boolean) {
        return this.userModel.updateOne({ _id, 'contacts.contact': contact }, { $set: { 'contacts.$.onList': value } })
    }

}
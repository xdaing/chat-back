import { IsString, Length, IsNotEmpty, IsEmail, IsArray } from 'class-validator'

export class UserLogin {

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 12)
    readonly password: string

}

export class UserRegister extends UserLogin {

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    readonly code: string

}

export class ApplicationData {

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    readonly applications: Array<string>
}
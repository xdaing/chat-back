import { IsString, Length, IsNotEmpty } from 'class-validator'
export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @Length(14, 20)
    account: string

    @IsString()
    @IsNotEmpty()
    @Length(6, 12)
    password: string
}
export class UserLoginDto extends CreateUserDto { }
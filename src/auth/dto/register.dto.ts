import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

export class RegisterRequest {
	@IsString({ message: 'Name needs to be string' })
	@IsNotEmpty({ message: 'Name can`t be empty' })
	@MaxLength(50, { message: 'Name can`t be over 50 characters' })
	name: string

	@IsEmail({}, { message: 'Invalid Email' })
	@IsString({ message: 'Name needs to be string' })
	@IsNotEmpty({ message: 'Name can`t be empty' })
	email: string

	@IsString({ message: 'Password needs to be string' })
	@IsNotEmpty({ message: 'Password can`t be empty' })
	@MinLength(6, { message: 'Password min 6 characters' })
	@MaxLength(128, { message: 'Password max 128 characters' })
	password: string
}

import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class RegisterInput {
	@Field(() => String)
	@IsString({ message: 'Name needs to be string' })
	@IsNotEmpty({ message: 'Name can`t be empty' })
	@MaxLength(50, { message: 'Name can`t be over 50 characters' })
	name: string

	@Field(() => String)
	@IsEmail({}, { message: 'Invalid Email' })
	@IsString({ message: 'Name needs to be string' })
	@IsNotEmpty({ message: 'Name can`t be empty' })
	email: string

	@Field(() => String)
	@IsString({ message: 'Password needs to be string' })
	@IsNotEmpty({ message: 'Password can`t be empty' })
	@MinLength(6, { message: 'Password min 6 characters' })
	@MaxLength(128, { message: 'Password max 128 characters' })
	password: string
}

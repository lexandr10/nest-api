import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { User, UserRole } from 'generated/prisma'
import { BaseModel } from 'src/common/models/base.model'

registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType({ description: 'User Model' })
export class UserModel extends BaseModel implements User {
	@Field(() => String)
	name: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => UserRole)
	role: UserRole
}

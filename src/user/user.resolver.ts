import { Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { UserModel } from './models/user.model'
import { Authorization } from 'src/auth/decorators/authorization.decorator'
import { Authorized } from 'src/auth/decorators/authorized'
import { User, UserRole } from 'generated/prisma'

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@Query(() => UserModel)
	getMe(@Authorized() user: User) {
		return user
	}

	@Authorization(UserRole.ADMIN)
	@Query(() => [UserModel])
	async getUsers() {
		return await this.userService.findAll()
	}
}

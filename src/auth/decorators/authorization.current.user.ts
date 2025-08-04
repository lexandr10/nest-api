import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { User } from 'generated/prisma'

export const Authrized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest() as Request

		const user = request.user

		return data ? user[data] : user
	}
)

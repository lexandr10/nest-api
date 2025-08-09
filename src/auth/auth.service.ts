import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

import { PrismaService } from 'src/prisma/prisma.service'
import { RegisterInput } from 'src/inputs/register.input'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { LoginInput } from 'src/inputs/login.input'
import type { Request, Response } from 'express'
import { isDev } from 'src/utils/is-dev.util'

@Injectable()
export class AuthService {
	private readonly JWT_SECRET: string
	private readonly JWT_ACCESS_TOKEN_TTL: string
	private readonly JWT_REFRESH_TOKEN_TTL: string
	private readonly COOKIE_DOMAIN: string
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET')
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
			'JWT_ACCESS_TOKEN_TTL'
		)
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
			'JWT_REFRESH_TOKEN_TTL'
		)
		this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN')
	}

	async register(res: Response, input: RegisterInput) {
		const { name, email, password } = input

		const existUser = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (existUser) {
			throw new ConflictException('User already exist')
		}

		const hashPass = await bcrypt.hash(password, 10)

		const user = await this.prismaService.user.create({
			data: {
				name,
				email,
				password: hashPass
			}
		})

		return this.auth(res, user.id)
	}

	async login(res: Response, input: LoginInput) {
		const { email, password } = input

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			select: {
				id: true,
				password: true
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}
		const verifyPass = await bcrypt.compare(password, user.password)

		if (!verifyPass) {
			throw new UnauthorizedException('Invalid password or email')
		}

		return this.auth(res, user.id)
	}

	async refresh(req: Request, res: Response) {
		const refreshToken = req.cookies['refreshToken']

		if (!refreshToken) {
			throw new UnauthorizedException('Invalid token')
		}

		const payload = await this.jwtService.verifyAsync(refreshToken)

		if (payload) {
			const user = await this.prismaService.user.findUnique({
				where: {
					id: payload.id
				},
				select: {
					id: true
				}
			})
			if (!user) {
				throw new NotFoundException('User not found')
			}
			return this.auth(res, user.id)
		}
	}

	private auth(res: Response, id: string) {
		const { accessToken, refreshToken } = this.generateToken(id)

		this.setCookie(
			res,
			refreshToken,
			new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
		)

		return { accessToken }
	}

	async validate(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async logout(res: Response) {
		this.setCookie(res, 'refreshToken', new Date(0))

		return true
	}

	private generateToken(id: string) {
		const payload = { id }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		})

		return { accessToken, refreshToken }
	}

	private setCookie(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIE_DOMAIN,
			expires,
			secure: !isDev(this.configService),
			sameSite: !isDev(this.configService) ? 'none' : 'lax'
		})
	}
}

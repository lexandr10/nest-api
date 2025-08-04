import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe())

	const config = new DocumentBuilder()
		.setTitle('Nest-js API')
		.setDescription('API documetation')
		.setVersion('1.0.0')
		.setContact('Oleskandr', 'https://sisi.com', 'support@sisi.com')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('/docs', app, document)
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

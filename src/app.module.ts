import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { SpotifyModule } from './spotify/spotify.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getSpofityConfig } from './config/spotify.config';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		SpotifyModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getSpofityConfig,
			inject: [ConfigService],
		}),
		ServeStaticModule.forRoot({
			rootPath: path.join(__dirname, '..', 'uploads'),
			serveRoot: '/api/static',
		}),
		FileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

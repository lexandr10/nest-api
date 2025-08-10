import { ConfigService } from "@nestjs/config";
import type { SpotifyOptions } from "src/spotify/interfaces/spotify.options.iterface";

export function getSpofityConfig(configService: ConfigService): SpotifyOptions {
	return {
		clientId: configService.getOrThrow<string>('SPOTIFY_CLIENT_ID'),
		clientSecret: configService.getOrThrow<string>('SPOFITY_CLIENT_SECRET'),
	}
}
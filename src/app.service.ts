import { SpotifyService } from './spotify/spotify.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
	constructor(private readonly spotifyService: SpotifyService) {}

	async getArtist(id: string) {
		const artist = await this.spotifyService.getArtist(id)

		return artist
	}

	async getAlbum(id: string) {
		const album = await this.spotifyService.getAlbum(id)

		return {
			total: album.total,
			title: album.href,
			releaseDate: album.previous
		}
	}
}
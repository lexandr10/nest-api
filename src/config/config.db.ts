import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV_FILES = {
	DB_HOST: process.env.POSTGRES_HOST || 'localhost',
	DB_PORT: process.env.POSTGRES_PORT || 5433,
	DB_USERNAME: process.env.POSTGRES_USER || 'postgres',
	DB_PASSWORD: process.env.POSTGRES_PASSWORD || '123456',
	DB_NAME: process.env.POSTGRES_DATABASE || 'nest_db'
}

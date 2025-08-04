import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ unique: true, length: 64 })
	email: string

	@Column()
	password: string

	@Column({ unique: true })
	fullname?: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}

import { Prisma, UserStatusEnum } from '@prisma/client';

import { PrismaService } from '../database';

import { users } from '@/models';

export class UsersRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async findUsers({
		name,
		status,
		skip,
		take,
	}: {
		name?: string;
		status?: UserStatusEnum;
		skip: number;
		take: number;
	}): Promise<[users[], number]> {
		const where: Prisma.usersWhereInput = {
			status: status,
			name: name
				? {
					contains: name,
					mode: 'insensitive',
				}
				: undefined,
		};

		return Promise.all([
			this.prismaService.users.findMany({
				where,
				skip: skip,
				take: take,
			}),
			this.prismaService.users.count({
				where,
			}),
		]);
	}

	async findUser({
		userId,
		email,
		userStatus,
	}: {
		userId?: string;
		email?: string;
		userStatus?: UserStatusEnum;
	}): Promise<users | null> {
		return this.prismaService.users.findFirst({
			where: {
				id: userId,
				email: email,
				status: userStatus,
			},
		});
	}

	async updateUser({
		userId,
		user,
	}: {
		userId: string;
		user: Prisma.usersUpdateManyMutationInput;
	}): Promise<users> {
		const { id, ...userData } = user;
		return this.prismaService.users.update({
			where: { id: userId },
			data: userData,
		});
	}
}

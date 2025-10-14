import { tokens, UserStatusEnum } from '@prisma/client';

import { Prisma, PrismaService } from '../database';

import {
	accountsWithPartialRelations,
	socialAccountsWithPartialRelations,
} from '@/models';

export class AuthRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async findAccount({
		accountId,
		userId,
		email,
		userStatus,
	}: {
		accountId?: string;
		userId?: string;
		email: string;
		userStatus?: UserStatusEnum;
	}): Promise<accountsWithPartialRelations | null> {
		return this.prismaService.accounts.findFirst({
			include: {
				user: true,
			},
			where: {
				id: accountId,
				user: {
					id: userId,
					email: email,
					status: userStatus,
				},
			},
		});
	}

	async findSocialAccount({
		userId,
		email,
		status,
	}: {
		email: string;
		userId?: string;
		status?: UserStatusEnum;
	}): Promise<socialAccountsWithPartialRelations | null> {
		return this.prismaService.socialAccounts.findFirst({
			include: {
				user: true,
			},
			where: {
				user: {
					email: email,
					id: userId,
					status: status,
				},
			},
		});
	}

	async createAccount({
		accounts,
	}: {
		accounts: Prisma.accountsCreateInput;
	}): Promise<accountsWithPartialRelations> {
		return this.prismaService.accounts.create({
			include: {
				user: true,
			},
			data: accounts,
		});
	}

	async createSocialAccount({
		socialAccount,
	}: {
		socialAccount: Prisma.socialAccountsCreateInput;
	}): Promise<socialAccountsWithPartialRelations> {
		return this.prismaService.socialAccounts.create({
			data: socialAccount,
		});
	}

	async createToken({ token }: { token: Prisma.tokensCreateInput }): Promise<tokens> {
		const { id, ...tokenData } = token;
		return this.prismaService.tokens.create({
			data: tokenData,
		});
	}

	async updatePassword({
		userId,
		password,
		salt,
	}: {
		userId: string;
		password: string;
		salt: string;
	}): Promise<accountsWithPartialRelations> {
		return this.prismaService.accounts.update({
			include: {
				user: true,
			},
			where: {
				userId: userId,
			},
			data: {
				password: password,
				salt: salt,
				user: {
					update: {
						verify: true,
					},
				},
			},
		});
	}
}

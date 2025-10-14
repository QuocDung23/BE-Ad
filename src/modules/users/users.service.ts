import { Prisma, users } from '@prisma/client';
import { Exception } from '@tsed/exceptions';
import { genSalt, hash } from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { AuthRepository } from '../auth/auth.repository';

import {
	GetUserByUserIdRequestDto,
	GetUserResponseDto,
	GetUsersRequestDto,
	GetUsersResponseDto,
	UpdateMyInformationRequestDto,
	UpdateMyPasswordRequestDto,
	UserInformationDto,
} from './dtos';
import { UsersRepository } from './users.repository';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	ObjectComparerDto,
	OptionalException,
	PaginationDto,
	PaginationUtils,
} from '@/common';

export class UsersService {
	constructor(
		private readonly authRepository: AuthRepository = new AuthRepository(),
		private readonly usersRepository: UsersRepository = new UsersRepository(),
	) {}

	async getUsers(
		getUsersRequest: GetUsersRequestDto,
		pagination: PaginationDto,
	): Promise<HttpResponseBodySuccessDto<GetUsersResponseDto[]>> {
		const { name, status } = getUsersRequest;
		const paginationUtils = new PaginationUtils().extractSkipTakeFromPagination(
			pagination,
		);
		const [users, totalUsers] = await this.usersRepository.findUsers({
			name: name,
			status: status,
			skip: 1,
			take: 10,
		});

		const userResponse = users.map((user) => new GetUsersResponseDto(user));
		return {
			success: true,
			data: userResponse,
			pagination:
				paginationUtils.convertPaginationResponseDtoFromTotalRecords(totalUsers),
		};
	}

	async getUserByUserId(
		getUserByUserIdRequestDto: GetUserByUserIdRequestDto,
	): Promise<HttpResponseBodySuccessDto<GetUserResponseDto>> {
		const { userId, status } = getUserByUserIdRequestDto;
		const user = await this.usersRepository.findUser({
			userId: userId,
			userStatus: status,
		});

		if (!user) {
			throw new NotFoundException('userId');
		}

		return {
			success: true,
			data: new GetUserResponseDto(user),
		};
	}

	async getMyInformation(
		myInformationDto: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<GetUserResponseDto>> {
		return {
			success: true,
			data: new GetUserResponseDto(myInformationDto),
		};
	}

	async updateMyInformation(
		updateMyInformationRequestDto: UpdateMyInformationRequestDto,
		myInformationDto: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<GetUserResponseDto> | Exception> {
		const updateUserData = new ObjectComparerDto<users>(
			myInformationDto,
		).getUpdatedFields<Prisma.usersUpdateManyMutationInput>(
			updateMyInformationRequestDto,
		);
		if (Object.keys(updateUserData).length === 0) {
			return new OptionalException(
				StatusCodes.UNPROCESSABLE_ENTITY,
				'No fields to update',
			);
		}

		const updatedUser = await this.usersRepository.updateUser({
			userId: myInformationDto.id,
			user: updateUserData,
		});

		return {
			success: true,
			data: new GetUserResponseDto(updatedUser),
		};
	}

	async updateMyPassword(
		updateMyPasswordRequestDto: UpdateMyPasswordRequestDto,
		myInformationDto: UserInformationDto,
	): Promise<HttpResponseBodySuccessDto<GetUserResponseDto> | Exception> {
		const { newPassword } = updateMyPasswordRequestDto;
		const account = await this.authRepository.findAccount({
			userId: myInformationDto.id,
			email: myInformationDto.email,
		});

		const salt = await genSalt(10);
		const hashedPassword = await hash(newPassword, salt);

		if (!account) {
			const account: Prisma.accountsCreateInput = {
				salt: salt,
				password: hashedPassword,
				user: {
					connect: {
						id: myInformationDto.id,
					},
				},
			};

			await this.authRepository.createAccount({
				accounts: account,
			});
		}

		await this.authRepository.updatePassword({
			userId: myInformationDto.id,
			salt: salt,
			password: hashedPassword,
		});

		return {
			success: true,
			data: new GetUserResponseDto(myInformationDto),
		};
	}
}

import z from 'zod';

import { ZodValidationSchema } from '@/common';

export class UpdateMyInformationRequestDto {
	name?: string;
	email?: string;
	bio?: string;
	avatarUrl?: string;
	address?: string;

	constructor(data: Partial<UpdateMyInformationRequestDto> = {}) {
		this.name = data.name;
		this.email = data.email;
		this.bio = data.bio;
		this.avatarUrl = data.avatarUrl;
		this.address = data.address;
	}
}

const updateMyInformationRequestBody = z
	.object({
		name: z.string().optional(),
		email: z.email().optional(),
		bio: z.string().optional(),
		avatarUrl: z.url().optional(),
		address: z.string().optional(),
	})
	.strict();

export const updateMyInformationRequestValidationSchema: ZodValidationSchema = {
	query: updateMyInformationRequestBody,
};

export const updateMyInformationRequestSchema = {
	query: updateMyInformationRequestBody,
};

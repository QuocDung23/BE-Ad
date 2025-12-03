import z from 'zod';

import { ZodValidationSchema } from '@/common/middlewares/validationRequest.middleware';

export class UpdateMyPasswordRequestDto {
	newPassword: string;

	constructor(data: UpdateMyPasswordRequestDto) {
		this.newPassword = data.newPassword;
	}
}

const updateMyPasswordRequestBody = z
	.object({
		newPassword: z.string().min(8),
	})
	.strict();

export const updateMyPasswordRequestValidationSchema: ZodValidationSchema = {
	query: updateMyPasswordRequestBody,
};

export const updateMyPasswordRequestSchema = {
	query: updateMyPasswordRequestBody,
};

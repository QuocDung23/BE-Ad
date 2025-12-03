import { ProjectStatusEnum } from '@prisma/client';
import z from 'zod';

import { ZodValidationSchema } from '@/common';

export class CreateProjectRequestDto {
	title: string;
	description?: string;

	constructor(data?: Partial<CreateProjectRequestDto>) {
		this.title = data?.title || '';
		this.description = data?.description;
	}
}

export const createProjectRequestValidationSchema: ZodValidationSchema = {
	body: z.object({
		title: z.string().min(1).max(255),
		description: z.string().max(1000).optional(),
	}),
};

export const createProjectRequestSchema = {
	body: {
		description: 'Create a new project',
		content: {
			'application/json': {
				schema: createProjectRequestValidationSchema.body!,
			},
		},
	},
};


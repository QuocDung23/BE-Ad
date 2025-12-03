import { ProjectStatusEnum, projects } from '@prisma/client';
import z from 'zod';

export class ProjectResponseDto {
	id: string;
	title: string;
	description: string | null;
	status: ProjectStatusEnum;
	createdAt: Date;
	updatedAt: Date;
	deleteAt: Date | null;

	constructor(project: projects) {
		this.id = project.id;
		this.title = project.title;
		this.description = project.description;
		this.status = project.status;
		this.createdAt = project.createdAt;
		this.updatedAt = project.updatedAt;
		this.deleteAt = project.deleteAt;
	}
}

export const projectResponseDtoSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	description: z.string().nullable(),
	status: z.enum(ProjectStatusEnum),
	createdAt: z.date(),
	updatedAt: z.date(),
	deleteAt: z.date().nullable(),
});


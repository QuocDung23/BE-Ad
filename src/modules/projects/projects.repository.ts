import { Prisma, ProjectStatusEnum } from '@prisma/client';

import { PrismaService } from '../database';

import { projects } from '@prisma/client';
import { ConflictException } from '@/common/exceptions/conflict.exception';

export class ProjectsRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async createProject({
		project,
	}: {
		project: Prisma.projectsCreateInput;
	}): Promise<projects> {
		if (!project.title || !project.description) {
			throw new Error('Project must have a title and description');
		}

		const existingProject = await this.prismaService.projects.findFirst({
			where: {
				title: project.title,
				deleteAt: null,
			},
		});

		if (existingProject) {
			throw new ConflictException('Project title already exists');
		}
		return this.prismaService.projects.create({
			data: project,
		});
	}

	async findProject({
		projectId,
		status,
	}: {
		projectId?: string;
		status?: ProjectStatusEnum;
	}): Promise<projects | null> {
		return this.prismaService.projects.findFirst({
			where: {
				id: projectId,
				status: status,
			},
		});
	}

	async findProjects({
		title,
		status,
		skip,
		take,
	}: {
		title?: string;
		status?: ProjectStatusEnum;
		skip: number;
		take: number;
	}): Promise<[projects[], number]> {
		return Promise.all([
			this.prismaService.projects.findMany({
				where: {
					title: title ? { contains: title, mode: 'insensitive' } : undefined,
					status: status,
				},
				skip: skip,
				take: take,
			}),
			this.prismaService.projects.count({
				where: {
					title: title ? { contains: title, mode: 'insensitive' } : undefined,
					status: status,
				},
			}),
		]);
	}

	async updateProject({
		projectId,
		project,
	}: {
		projectId: string;
		project: Prisma.projectsUpdateInput;
	}): Promise<projects> {
		return this.prismaService.projects.update({
			where: { id: projectId },
			data: project,
		});
	}

	async deleteProject({ projectId }: { projectId: string }): Promise<projects> {
		return this.prismaService.projects.update({
			where: { id: projectId },
			data: {
				deleteAt: new Date(),
			},
		});
	}
}

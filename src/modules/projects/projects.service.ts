import { Prisma, ProjectStatusEnum } from '@prisma/client';
import {Exception } from '@tsed/exceptions';
import { StatusCodes } from 'http-status-codes';

import { ProjectsRepository } from './projects.repository';
import { CreateProjectRequestDto, ProjectResponseDto } from './dtos';

import {
	HttpResponseBodySuccessDto,
	NotFoundException,
	OptionalException,
} from '@/common';

export class ProjectsService {
	constructor(
		private readonly projectsRepository: ProjectsRepository = new ProjectsRepository(),
	) {}

	async createProject(
		createProjectDto: CreateProjectRequestDto,
	): Promise<HttpResponseBodySuccessDto<ProjectResponseDto> | Exception> {
		const project: Prisma.projectsCreateInput = {
			title: createProjectDto.title,
			description: createProjectDto.description || null,
			status: ProjectStatusEnum.ACTIVE,
		};

		const newProject = await this.projectsRepository.createProject({
			project: project,
		});

		return {
			success: true,
			data: new ProjectResponseDto(newProject),
		};
	}

	async getProject({
		projectId,
		status,
	}: {
		projectId: string;
		status?: ProjectStatusEnum;
	}): Promise<HttpResponseBodySuccessDto<ProjectResponseDto> | Exception> {
		const project = await this.projectsRepository.findProject({
			projectId: projectId,
			status: status,
		});

		if (!project) {
			throw new NotFoundException('project');
		}

		return {
			success: true,
			data: new ProjectResponseDto(project),
		};
	}

	async getProjects({
		title,
		status,
		skip,
		take,
	}: {
		title?: string;
		status?: ProjectStatusEnum;
		skip: number;
		take: number;
	}): Promise<HttpResponseBodySuccessDto<ProjectResponseDto[]>> {
		const [projects, totalProjects] = await this.projectsRepository.findProjects({
			title: title,
			status: status,
			skip: skip,
			take: take,
		});

		const projectsResponse = projects.map(
			(project) => new ProjectResponseDto(project),
		);

		return {
			success: true,
			data: projectsResponse,
		};
	}
}


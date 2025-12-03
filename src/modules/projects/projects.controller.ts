import { Exception } from '@tsed/exceptions';
import { Request, Response } from 'express';

import {
	CreateProjectRequestDto,
	ProjectResponseDto,
} from './dtos';
import { ProjectsService } from './projects.service';

import { HttpResponseDto } from '@/common';

export class ProjectsController {
	constructor(private readonly projectsService = new ProjectsService()) {}

	async createProject(req: Request): Promise<Response> {
		const createProjectDto = new CreateProjectRequestDto(req.body);
		const result = await this.projectsService.createProject(createProjectDto);
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().created<ProjectResponseDto>(result);
	}

	async getProject(req: Request): Promise<Response> {
		const { projectId } = req.params;
		const status = req.query.status as string | undefined;

		const result = await this.projectsService.getProject({
			projectId: projectId,
			status: status as any,
		});
		if (result instanceof Exception) {
			return new HttpResponseDto().exception(result);
		}
		return new HttpResponseDto().success<ProjectResponseDto>(result);
	}

	async getProjects(req: Request): Promise<Response> {
		const title = req.query.title as string | undefined;
		const status = req.query.status as string | undefined;
		const skip = parseInt(req.query.skip as string) || 0;
		const take = parseInt(req.query.take as string) || 10;

		const result = await this.projectsService.getProjects({
			title: title,
			status: status as any,
			skip: skip,
			take: take,
		});
		return new HttpResponseDto().success<ProjectResponseDto[]>(result);
	}
}


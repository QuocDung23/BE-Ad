import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

import {
	createProjectRequestSchema,
	createProjectRequestValidationSchema,
	projectResponseDtoSchema,
} from './dtos';
import { ProjectsController } from './projects.controller';

import { autoBindUtil, validateRequestMiddleware } from '@/common';
import authMiddleware from '@/common/middlewares/auth.middleware';
import { createApiResponse } from '@/swagger/openAPIResponseBuilders';

export const projectsRegistry = new OpenAPIRegistry();

const projectsController = new ProjectsController();
const router = express.Router({ mergeParams: true });
autoBindUtil(projectsController);

projectsRegistry.registerPath({
	method: 'post',
	path: '/projects',
	tags: ['Projects'],
	request: createProjectRequestSchema,
	responses: createApiResponse(
		projectResponseDtoSchema,
		'Success',
		StatusCodes.CREATED,
	),
});
router.post(
	'/',
	authMiddleware.verifyAccessToken,
	validateRequestMiddleware(createProjectRequestValidationSchema),
	projectsController.createProject,
);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects/{projectId}',
	tags: ['Projects'],
	responses: createApiResponse(projectResponseDtoSchema, 'Success', StatusCodes.OK),
});
router.get('/:projectId', authMiddleware.verifyAccessToken, projectsController.getProject);

projectsRegistry.registerPath({
	method: 'get',
	path: '/projects',
	tags: ['Projects'],
	responses: createApiResponse(
		projectResponseDtoSchema.array(),
		'Success',
		StatusCodes.OK,
	),
});
router.get('/', authMiddleware.verifyAccessToken, projectsController.getProjects);

export const projectsRouter = router;


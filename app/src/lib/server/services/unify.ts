import { UnifyService } from '~/lib/server/classes/unify-service.class';

export const unify = new UnifyService({
	hostname: process.env.UNIFY_HOST
		?? 'http://localhost:1234',
	basePath: '/api'
});

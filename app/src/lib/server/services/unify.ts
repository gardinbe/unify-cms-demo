import { UnifyService } from '~/lib/server/classes/unify-service.class';
import { throwExp } from '~/lib/utils';

export const unify = new UnifyService({
	hostname: process.env.UNIFY_HOST
		?? throwExp('Missing \'UNIFY_HOST\' environment variable'),
	basePath: '/api'
});

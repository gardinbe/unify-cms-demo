import { ApiService } from '~/lib/server/classes/api-service.class';
import type { HomePage, User, UsersPage } from '~/lib/types';

export class UnifyService extends ApiService {
	async getHomePage() {
		return this.get<HomePage>('/s/home-page');
	}

	async getUsersPage() {
		return this.get<UsersPage>('/s/users-page');
	}

	async getUsers() {
		return this.get<User[]>('/c/users');
	}

	async getUser(username: string) {
		return this.get<User>(`/c/users/${username}`);
	}
}

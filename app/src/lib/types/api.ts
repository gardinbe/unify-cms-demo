export interface ApiError {
	error: string;
}

interface Metadata {
	meta_title: string;
	meta_description: string;
}

export interface HomePage extends Metadata {
	heading: string;
	subheading: string;
	main_content: string;
	image_url: string;
}

export interface UsersPage extends Metadata {
	heading: string;
	subheading: string;
	main_content: string;
}

export interface User {
	id: number;
	username: string;
	name: string;
	age: number;
	bio: string;
	picture_url: string;
	is_cool: string;
}

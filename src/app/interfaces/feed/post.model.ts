import { FeedUser } from './user.model';

export interface Post {
	id: string;
	author: FeedUser;
	content: string;
	imageUrl?: string;
	createdAt: Date;
	likes: number;
	comments: number;
	shares: number;
	isLiked?: boolean;
	tags?: string[];
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Post } from '../../../interfaces/feed';

@Injectable({
	providedIn: 'root'
})
export class FeedService {
	getPosts(limit?: number, offset?: number): Observable<Post[]> {
		const mockPosts: Post[] = [
			{
				id: '1',
				is_official: true,
				author: {
					id: '101',
					email: 'elena@utp.edu',
					username: 'drelenastarling',
					fullName: 'Dr. Elena Sterling',
					role: 'Computer Science',
					avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
					verified: true
				},
				content: 'Thrilled to announce that our latest paper on Quantum Neural Networks has been accepted for the International Conference on Machine Learning! 🚀 #Research #QuantumComputing #Nexora',
				imageUrl: 'https://images.unsplash.com/photo-1518611505868-48510c2e022c?w=600&h=400&fit=crop',
				createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas
				likes: 1200,
				comments: 145,
				shares: 34,
				isLiked: false,
				tags: ['#Research', '#QuantumComputing', '#Nexora']
			},
			{
				id: '2',
				is_official: false,
				author: {
					id: '102',
					email: 'marcus@utp.edu',
					username: 'marcus_chen',
					fullName: 'Marcus Chen',
					role: 'Architecture & Design',
					avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
					verified: false
				},
				content: 'The new study hub in Building D is finally open! The Brutalist architecture combined with modern ergonomic seating makes it the perfect spot for late-night study sessions. Who\'s coming?',
				imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
				createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas
				likes: 456,
				comments: 89,
				shares: 23,
				isLiked: false,
				tags: ['#Campus', '#Community']
			}
		];

		if (limit === undefined || offset === undefined) {
			return of(mockPosts).pipe(delay(500));
		}

		const start = Math.max(offset, 0);
		const end = Math.max(start + limit, start);
		const page = mockPosts.slice(start, end);

		return of(page).pipe(delay(500));
	}
}

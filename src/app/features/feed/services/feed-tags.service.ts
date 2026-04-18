import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, map, Observable, of } from 'rxjs';

import { AVAILABLE_TAGS_QUERY } from '../../../graphql/graphql.queries';

interface AvailableTagQueryModel {
  id: string;
  name: string;
  usageCount: number;
}

interface AvailableTagsQueryResponse {
  availableTags: AvailableTagQueryModel[];
}

/**
 * Service to manage feed tags.
 * Suggested tags based on common academic topics.
 * Future: Connect to backend endpoint for dynamic tags.
 */
@Injectable({
  providedIn: 'root'
})
export class FeedTagsService {
  private readonly apollo = inject(Apollo);

  private readonly suggestedTags = [
    'ReactJS',
    'Angular',
    'TypeScript',
    'Java',
    'Python',
    'Database',
    'API',
    'DevOps',
    'WebDevelopment',
    'MobileApp',
    'AI',
    'MachineLearning',
    'CloudComputing',
    'Security',
    'Performance',
    'Testing',
    'Design',
    'UX',
    'Accessibility',
    'Documentation',
    'Research',
    'Campus',
    'Event',
    'News',
    'Tutorial',
    'Question',
    'Discussion',
    'Project',
    'Job',
    'Internship'
  ];

  /**
   * Get suggested tags for autocomplete.
   */
  getSuggestedTags(search = '', limit = 12): Observable<string[]> {
    return this.apollo
      .query<AvailableTagsQueryResponse>({
        query: AVAILABLE_TAGS_QUERY,
        variables: {
          search,
          limit
        },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map((result) => result.data?.availableTags?.map((tag) => tag.name) ?? []),
        map((tags) => (tags.length > 0 ? tags : this.filterTags(search, this.suggestedTags).slice(0, limit))),
        catchError(() => of(this.filterTags(search, this.suggestedTags).slice(0, limit)))
      );
  }

  /**
   * Filter tags based on search query.
   */
  filterTags(query: string, allTags: string[]): string[] {
    if (!query.trim()) {
      return allTags;
    }
    const lowerQuery = query.toLowerCase();
    return allTags.filter((tag) => tag.toLowerCase().includes(lowerQuery));
  }
}

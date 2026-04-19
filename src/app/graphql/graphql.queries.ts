import { gql } from 'apollo-angular';

export const FEED_POSTS_QUERY = gql`
	query FeedPosts($limit: Int!, $offset: Int!) {
		obtenerFeedPrincipal(limit: $limit, offset: $offset) {
			id
			titulo
			contenido
			tags
			location
			isOfficial
			createdAt
			commentsCount
			autor {
				id
				username
				fullName
				avatarUrl
			}
		}
	}
`;

export const PROFILE_POSTS_QUERY = gql`
	query ProfilePosts($username: String!, $limit: Int!, $offset: Int!) {
		publicacionesPorUsuario(username: $username, limit: $limit, offset: $offset) {
			id
			titulo
			contenido
			tags
			location
			isOfficial
			createdAt
			commentsCount
			autor {
				id
				username
				fullName
				avatarUrl
			}
		}
	}
`;

export const CREATE_PUBLICATION_MUTATION = gql`
	mutation CreatePublication($input: CreatePublicationInput!) {
		crearPublicacion(input: $input) {
			id
			titulo
			contenido
			tags
			location
			isOfficial
			createdAt
			commentsCount
			autor {
				id
				username
				fullName
				avatarUrl
			}
		}
	}
`;

export const AVAILABLE_TAGS_QUERY = gql`
	query AvailableTags($search: String, $limit: Int) {
		availableTags(search: $search, limit: $limit) {
			id
			name
			usageCount
		}
	}
`;

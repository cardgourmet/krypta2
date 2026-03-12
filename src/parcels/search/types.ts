import type {components as c} from '@/schema/api';

export type ExplainSearchQuery = c['schemas']['ExplainSearchQueryResponse'];
export type SearchQueryStatistics = c['schemas']['SearchQueryStatistics'];

export type UserSavedSearch = c['schemas']['UserSavedSearch'];
export type UserResolvedSavedSearch = c['schemas']['ResolvedUserSavedSearch'];

export type PagedUserSavedSearch = c['schemas']['SimplePage-ResolvedUserSavedSearch'];
export type UserSearchQueryStatistics = c['schemas']['UserSearchQueryStatistics'];

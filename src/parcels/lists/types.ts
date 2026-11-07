import type { components as c } from '@/schema/api';

export type UserListResponse = c['schemas']['SimplePage-ApiUserListWithResources'];
export type UserListWithResources = c['schemas']['ApiUserListWithResources'];
export type UserList = c['schemas']['ApiUserList'];
export type UserListResource = c['schemas']['UserListResource'];
export type UserListThumbnail = c['schemas']['ApiUserListThumbnail'];
export type UserListThumbnailCrop = c['schemas']['UserListThumbnailCrop'];

export type UserListUpdate = c['schemas']['UserListUpdate'];
export type UserListThumbnailUpdate = c['schemas']['UserListThumbnailUpdate'];

export type ResolvedUserListResource = c['schemas']['ResolvedUserListResource'];

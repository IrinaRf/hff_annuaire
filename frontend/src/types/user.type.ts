export const UserRole = {
	USER: 0,
	ADMIN: 1,
} as const;

export type TypeUserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
	id: string;
	mail: string;
	email: string;
	username: string;
	fullname: string | null;
	name: string | null;
	displayname: string | null;
	role: TypeUserRole;
	roles: number[];
	url_logout: string | null;
}

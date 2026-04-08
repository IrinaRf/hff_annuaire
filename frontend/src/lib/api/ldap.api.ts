import { apiClient } from "./client";

export interface LdapUser {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	fullname: string;
	function: string;
	landline: string;
	phone: string;
	mail: string;
	email: string;
	location: string;
}

export const ldapApi = {
	list: async () => {
		const res = await apiClient.get<LdapUser[]>('/directory');
		return res.data;
	}
}
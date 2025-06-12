import { PaginatedResponse, IUser } from "@shared/types";

export class UserService {
    public async getUsers(
        page?: number,
        limit?: number,
        sort?: "asc" | "desc",
        sortBy?: string
    ): Promise<PaginatedResponse<IUser>> {
        let url: string = `${VITE_API_URL}users?page=${page}&limit=${limit}`;

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (sortBy) {
            url += `&sortBy=${sortBy}`;
        }

        const response: Response = await fetch(url, {
            credentials: "include",
        });

        return await response.json() as unknown as PaginatedResponse<IUser>;
    }

    public async toggleAdminRole(userId: number): Promise<string> {
        const response: Response = await fetch(`${VITE_API_URL}users/${userId}/toggle-admin`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to update user role");
        }

        const role: string = await response.json() as unknown as string;

        return role;
    }
}

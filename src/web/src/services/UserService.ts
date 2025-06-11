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

        const res: Response = await fetch(url, {
            credentials: "include",
        });

        return await res.json() as unknown as PaginatedResponse<IUser>;
    }
}

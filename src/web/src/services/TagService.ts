import { ITagService } from "@web/interfaces/ITagService";
import { Tag } from "@shared/types";

export class TagService implements ITagService {
    public async getTags(): Promise<Tag[]> {
        const res: Response = await fetch(`${VITE_API_URL}tags`);
        return await res.json() as unknown as Tag[];
    }

    public async getTag(id: number): Promise<Tag> {
        const res: Response = await fetch(`${VITE_API_URL}tags/${id}`);
        return await res.json() as unknown as Tag;
    }

    public async createTag(tag: Tag): Promise<Tag> {
        const res: Response = await fetch(`${VITE_API_URL}tags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
            credentials: "include",
        });
        return await res.json() as unknown as Tag;
    }

    public async updateTag(tag: Tag): Promise<Tag> {
        const res: Response = await fetch(`${VITE_API_URL}tags/${tag.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tag),
            credentials: "include",
        });
        return await res.json() as unknown as Tag;
    }

    public async deleteTag(id: number): Promise<void> {
        await fetch(`${VITE_API_URL}tags/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    }
}

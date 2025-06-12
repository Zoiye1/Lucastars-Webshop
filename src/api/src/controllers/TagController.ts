import { ITagService } from "@api/interfaces/ITagService";
import { TagService } from "@api/services/TagsService";
import { Tag } from "@shared/types";
import { Request, Response } from "express";

export class TagController {
    private readonly _tagService: ITagService = new TagService();

    public async getTags(_req: Request, res: Response): Promise<void> {
        const tags: Tag[] = await this._tagService.getTags();

        res.json(tags);
    }

    public async getTagById(req: Request, res: Response): Promise<void> {
        const tagId: number | undefined = req.params.id ? parseInt(req.params.id) : undefined;

        if (!tagId || isNaN(tagId)) {
            res.status(400).json({ error: "Missing tag ID" });
            return;
        }

        const tag: Tag | undefined = await this._tagService.getTagById(tagId);

        if (!tag) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }

        res.json(tag);
    }

    public async createTag(req: Request, res: Response): Promise<void> {
        const tag: Tag | undefined = req.body as Tag | undefined;

        // Validate the tag object by checking if the properties are defined and have the correct types
        if (!tag || typeof tag.value !== "string" || !tag.value.trim()) {
            res.status(400).json({ error: "Invalid tag data" });
            return;
        }

        const createdTag: Tag = await this._tagService.createTag(tag);

        res.json(createdTag);
    }

    public async updateTag(req: Request, res: Response): Promise<void> {
        const tag: Tag | undefined = req.body as Tag | undefined;

        // Validate the tag object by checking if the properties are defined and have the correct types
        if (!tag || typeof tag.value !== "string" || !tag.value.trim()) {
            res.status(400).json({ error: "Invalid tag data" });
            return;
        }

        const updatedTag: Tag = await this._tagService.updateTag(tag);

        res.json(updatedTag);
    }

    public async deleteTag(req: Request, res: Response): Promise<void> {
        const tagId: number | undefined = req.params.id ? parseInt(req.params.id) : undefined;

        if (!tagId || isNaN(tagId)) {
            res.status(400).json({ error: "Missing tag ID" });
            return;
        }

        await this._tagService.deleteTag(tagId);

        res.status(200).send();
    }
}

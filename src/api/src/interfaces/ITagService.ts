import { Tag } from "@shared/types";

@Interface
export abstract class ITagService {
    public abstract getTags(): Promise<Tag[]>;
    public abstract getTagById(tagId: number): Promise<Tag | undefined>;
    public abstract createTag(tag: Tag): Promise<Tag>;
    public abstract updateTag(tag: Tag): Promise<Tag>;
    public abstract deleteTag(tagId: number): Promise<void>;
}

import { File } from "formidable";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

export type Image = {
    mimetype: string;
    name: string;
    file: Buffer;
};

export class GameImageService {
    private readonly _uploadsDir: string = path.resolve("uploads");

    public constructor() {
        // Ensure the uploads directory exists
        fs.mkdir(this._uploadsDir, { recursive: true })
            .catch((error: unknown) => {
                console.error(`Failed to create uploads directory ${this._uploadsDir}:`, error);
                throw new Error(`Could not create uploads directory: ${this._uploadsDir}`);
            });
    }

    public async uploadImage(gameId: number, file: File): Promise<string> {
        const fileExtension: string | undefined = file.mimetype ? this.mimeToExtension(file.mimetype) : undefined;

        if (!fileExtension) {
            throw new Error("Unsupported file type. Only JPEG, PNG, and SVG images are allowed.");
        }

        const fileName: string = `${uuidv4()}${fileExtension || ".png"}`;

        const uploadDir: string = path.resolve(this._uploadsDir, "games", gameId.toString());

        console.log(`Uploading image for game ${gameId} to ${uploadDir} for file ${fileName}`);

        await fs.mkdir(uploadDir, { recursive: true });

        const destPath: string = path.join(uploadDir, fileName);

        await fs.copyFile(file.filepath, destPath);

        return path.join("games", gameId.toString(), fileName);
    }

    public async getImage(image: string): Promise<Image | undefined> {
        const imagePath: string = path.join(this._uploadsDir, image);
        this.ensureWithinUploadsDir(imagePath);

        const absImagePath: string = path.resolve(imagePath);

        try {
            const fileName: string = path.basename(absImagePath);
            const imageFile: Image = {
                mimetype: this.extensionToMime(path.extname(fileName)) || "application/octet-stream",
                name: fileName,
                file: await fs.readFile(absImagePath),
            };

            return imageFile;
        }
        catch (error: unknown) {
            const errorObject: { code?: string } = error as { code?: string };

            // If the file does not exist, we can ignore the error
            if (errorObject.code !== "ENOENT") {
                console.error(`Error accessing image ${absImagePath}:`, error);
                throw error;
            }

            return undefined;
        }
    }

    public async deleteImages(gameId: number): Promise<void> {
        const uploadDir: string = path.resolve(this._uploadsDir, "games", gameId.toString());

        try {
            // Check if the directory exists
            await fs.access(uploadDir);

            // Remove the directory and all its contents
            await fs.rm(uploadDir, { recursive: true, force: true });
        }
        catch (error: unknown) {
            const errorObject: { code?: string } = error as { code?: string };

            // If the directory does not exist, we can ignore the error
            if (errorObject.code !== "ENOENT") {
                console.error(`Error deleting images for game ${gameId}:`, errorObject.code);
                throw error;
            }
        }
    }

    /**
     * Converts a MIME type to a file extension.
     * @remarks Only supports a few common image types.
     */
    private mimeToExtension(mimeType: string): string | undefined {
        const extensionMap: Record<string, string> = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
        };

        return extensionMap[mimeType] || undefined;
    }

    /**
     * Converts a file extension to a MIME type.
     * @remarks Only supports a few common image types.
     */
    private extensionToMime(extension: string): string | undefined {
        const mimeMap: Record<string, string> = {
            ".jpg": "image/jpeg",
            ".png": "image/png",
        };

        return mimeMap[extension.toLowerCase()] || undefined;
    }

    private ensureWithinUploadsDir(targetPath: string): void {
        const normalized: string = path.normalize(targetPath);

        if (!normalized.startsWith(this._uploadsDir)) {
            throw new Error("Access denied: Path traversal detected.");
        }
    }
}

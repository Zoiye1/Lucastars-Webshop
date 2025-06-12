import { Request, Response as ExpressResponse } from "express";

/**
 * Because lucastars.hbo-ict.cloud uses cors for their media.
 * We need to proxy the image requests since node doesn't include cors headers.
 */
export class ImageProxyController {
    public async getImage(req: Request, res: ExpressResponse): Promise<void> {
        const imageUrl: string = req.query.url as string;

        if (!imageUrl) {
            res.status(400).send("Image URL is required");
            return;
        }

        // Only allow URLs from the specified domain
        const allowedPrefix: string = "https://lucastars.hbo-ict.cloud/media/";
        if (!imageUrl.startsWith(allowedPrefix)) {
            res.status(403).send("Forbidden: Invalid image URL");
            return;
        }

        try {
            const response: Response = await fetch(imageUrl);

            if (!response.ok) {
                res.status(404).send("Image not found");
                return;
            }

            res.setHeader("Content-Type", response.headers.get("Content-Type") || "application/octet-stream");
            res.setHeader("Content-Length", response.headers.get("Content-Length") || "0");

            if (!response.body) {
                res.status(500).send("No response body");
                return;
            }

            const imageBuffer: ArrayBuffer = await response.arrayBuffer();
            res.send(Buffer.from(imageBuffer));
        }
        catch (error) {
            console.error("Error fetching image:", error);
            res.status(500).send("Error fetching image");
        }
    }
}

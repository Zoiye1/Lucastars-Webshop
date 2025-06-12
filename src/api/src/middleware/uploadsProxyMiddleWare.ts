import { ImageProxyController } from "@api/controllers/ImageProxyController";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle requests for LucaStars uploads.
 * It will proxy the request if its trying to access a LucaStars upload URL.
 */
export async function uploadsProxyMiddleWare(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Remove slash at the start of the path
    const path: string = req.path.substring(1);

    if (!path.startsWith("https://lucastars.hbo-ict.cloud/media/")) {
        next();

        return;
    }

    const imageProxyController: ImageProxyController = new ImageProxyController();

    // Set the URL query parameter for the image proxy
    req.query.url = path;

    await imageProxyController.getImage(req, res);
}

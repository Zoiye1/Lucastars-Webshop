import { NextFunction, Request, Response } from "express";
import formidable from "formidable";

export async function formidableMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
    // If the request has already been parsed, skip parsing again
    if (req.formidableParsed) {
        next();

        return;
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const form = formidable({
        allowEmptyFiles: false,
    });

    try {
        const [fields, files] = await form.parse(req);

        req.fields = fields;
        req.files = files;
        req.formidableParsed = true;

        next();
    }
    catch (error: unknown) {
        next(error);

        return;
    }
}

import { Fields, Files } from "formidable";

declare global {
    namespace Express {
        export interface Request {
            sessionId?: string;
            userId?: number;
            userRole?: string;
            formidableParsed?: boolean;
            fields?: Fields;
            files?: Files;
        }
    }

    /**
     * Allow a function to be awaited, even if its not explicitly asynchronous.
     *
     * @template T Return type of the function
     */
    type SyncOrAsync<T> = T | Promise<T>;
}

export { };

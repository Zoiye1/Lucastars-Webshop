import { UserSession } from "@shared/types";

@Interface
export abstract class ISessionService {
    public abstract createSession(userId: number): Promise<string | undefined>;
    public abstract getUserBySession(sessionId: string): Promise<UserSession | undefined>;
    public abstract deleteSession(sessionId: string): Promise<boolean>;
    public abstract deleteExpiredSessions(): Promise<void>;
}

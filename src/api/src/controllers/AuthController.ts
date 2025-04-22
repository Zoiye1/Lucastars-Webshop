import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { SessionService } from "../services/SessionService";
import { AuthReponse, IUserRegisterDTO, IUser } from "@shared/types";

export class AuthController {
    private readonly _userService: UserService = new UserService();
    private readonly _sessionService: SessionService = new SessionService();

    /**
     * Register a new user
     */
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("Register request received:", req.body);
            const userData: IUserRegisterDTO = req.body as IUserRegisterDTO;

            // Basic validation
            if (!userData.username || !userData.email || !userData.password ||
              !userData.confirmPassword || !userData.firstName || !userData.lastName) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "All required fields must be filled in",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Passwords do not match",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            // Check if user already exists
            const existingUserByEmail: IUser | undefined = await this._userService.getUserByEmail(userData.email);
            if (existingUserByEmail) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Email already in use",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            const existingUserByUsername: IUser | undefined = await this._userService.getUserByUsername(userData.username);
            if (existingUserByUsername) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Username already taken",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            // Create user
            const userId: number | undefined = await this._userService.createUser(
                userData.username,
                userData.email,
                userData.firstName,
                userData.prefix,
                userData.lastName,
                userData.password
            );

            if (!userId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Failed to create user",
                };
                console.log("Sending error response:", errorResponse);
                res.status(500).json(errorResponse);
                return;
            }

            // Create session
            const sessionId: string | undefined = await this._sessionService.createSession(userId);

            if (!sessionId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Failed to create session",
                };
                console.log("Sending error response:", errorResponse);
                res.status(500).json(errorResponse);
                return;
            }

            // Set session cookie
            res.cookie("session", sessionId, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            const successResponse: AuthReponse = {
                success: true,
                message: "User registered successfully",
                sessionId,
            };
            console.log("Sending success response:", successResponse);
            res.status(201).json(successResponse);
        }
        catch (error) {
            console.error("Registration error:", error);
            const errorResponse: AuthReponse = {
                success: false,
                message: "Internal server error",
            };
            console.log("Sending error response:", errorResponse);
            res.status(500).json(errorResponse);
        }
    };
}

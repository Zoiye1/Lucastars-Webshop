// src/web/src/services/AuthService.ts

import { IUserRegisterDTO, IAuthResponse } from "../../../shared/types";

export class AuthService {
    private readonly API_URL: string = "/api";

    /**
     * Register a new user
     */
    public async register(userData: IUserRegisterDTO): Promise<IAuthResponse> {
        try {
            console.log("Sending registration data:", userData);

            const url: string = `${this.API_URL}/auth/register`;
            console.log("Sending request to:", url);

            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include", // Include cookies for session
            });

            console.log("Response status:", response.status, response.statusText);

            // Check if response is ok
            if (!response.ok) {
                console.error(`Server returned ${response.status}: ${response.statusText}`);
                return {
                    success: false,
                    message: `Server error: ${response.status} ${response.statusText}`,
                };
            }

            // Try to read the response text first
            let text: string;
            try {
                text = await response.text();
                console.log("Raw response text:", text);
            }
            catch (readError) {
                console.error("Error reading response text:", readError);
                return {
                    success: false,
                    message: "Failed to read server response",
                };
            }

            if (!text || text.trim() === "") {
                console.warn("Server returned empty response");
                return {
                    success: false,
                    message: "Server returned empty response",
                };
            }

            // Parse the text as JSON
            try {
                const data: IAuthResponse = JSON.parse(text) as IAuthResponse;
                console.log("Parsed response data:", data);
                return data;
            }
            catch (parseError) {
                console.error("JSON parse error:", parseError);
                console.error("Response text that failed to parse:", text);
                return {
                    success: false,
                    message: "Invalid response format from server",
                };
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            return {
                success: false,
                message: "An error occurred during registration",
            };
        }
    }
}

// Create a singleton instance
export const authService: AuthService = new AuthService();

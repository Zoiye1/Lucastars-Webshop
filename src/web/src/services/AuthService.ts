import { IUserRegisterDTO, IAuthResponse } from "@shared/types";

export class AuthService {
    /**
     * Register a new user
     */
    public async register(userData: IUserRegisterDTO): Promise<IAuthResponse> {
        try {
            const url: string = `${VITE_API_URL}auth/register`;

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

            // Rest of the method remains the same...
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
                const errorMessage: string = parseError instanceof Error ? parseError.message : String(parseError);
                console.error("JSON parse error:", errorMessage);
                console.error("Response text that failed to parse:", text);
                return {
                    success: false,
                    message: "Invalid response format from server",
                };
            }
        }
        catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            console.error("Registration error:", errorMessage);
            return {
                success: false,
                message: "An error occurred during registration",
            };
        }
    }
}

// Create a singleton instance
export const authService: AuthService = new AuthService();

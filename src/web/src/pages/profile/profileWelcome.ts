// src/pages/profile/profileWelcome.ts
import { html } from "@web/helpers/webComponents";
import { authService } from "@web/services/AuthService";
import { IUser } from "@shared/types";

export class ProfileWelcomeComponent extends HTMLElement {
    private user: IUser | null = null;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Check if user is logged in
        const isLoggedIn: boolean = await authService.isLoggedIn();
        if (!isLoggedIn) {
            window.location.href = "/login.html";
            return;
        }

        // Load user data
        await this.loadUserData();
        this.render();
    }

    private async loadUserData(): Promise<void> {
        try {
            // This would normally fetch from your API
            // For now, using dummy data
            this.user = {
                id: 1,
                username: "gebruiker123",
                email: "gebruiker@example.com",
                firstName: "Jan",
                prefix: "van",
                lastName: "Dijk",
                street: "Hoofdstraat",
                houseNumber: "123",
                postalCode: "1234 AB",
                city: "Amsterdam",
                country: "Nederland",
                created: new Date(),
                updated: new Date(),
            };
        }
        catch (error) {
            console.error("Failed to load user data:", error);
        }
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                    display: block;
                }
                
                .welcome-header {
                    margin-bottom: 30px;
                }
                
                h1 {
                    color: #333;
                    margin: 0 0 10px 0;
                }
                
                .subtitle {
                    color: #666;
                    font-size: 16px;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                
                .stat-card {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .stat-number {
                    font-size: 32px;
                    font-weight: bold;
                    color: #159eff;
                    margin: 10px 0;
                }
                
                .stat-label {
                    color: #666;
                    font-size: 14px;
                }
                
                .quick-actions {
                    margin-top: 40px;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }
                
                .action-button {
                    padding: 12px 24px;
                    background-color: #159eff;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 16px;
                    text-decoration: none;
                    display: inline-block;
                    transition: background-color 0.3s ease;
                }
                
                .action-button:hover {
                    background-color: #0078cd;
                }
                
                .action-button.secondary {
                    background-color: #6c757d;
                }
                
                .action-button.secondary:hover {
                    background-color: #5a6268;
                }
            </style>
        `;

        const fullName: string = this.user
            ? `${this.user.firstName} ${this.user.prefix ? this.user.prefix + " " : ""}${this.user.lastName}`
            : "Gebruiker";

        const element: HTMLElement = html`
            <div class="welcome-header">
                <h1>Welkom terug, ${fullName}!</h1>
                <p class="subtitle">Beheer je account en bekijk je activiteiten</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">12</div>
                    <div class="stat-label">Bestellingen</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">3</div>
                    <div class="stat-label">Reviews</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">7</div>
                    <div class="stat-label">Verlanglijst</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">€45</div>
                    <div class="stat-label">Spaarpunten</div>
                </div>
            </div>
            
            <div class="quick-actions">
                <h2>Snelle acties</h2>
                <div class="action-buttons">
                    <a href="/profile/account" class="action-button">Account bewerken</a>
                    <a href="/games.html" class="action-button secondary">Games bekijken</a>
                    <a href="/profile/orders" class="action-button secondary">Bestellingen bekijken</a>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add click handlers for navigation
        this.shadowRoot.querySelectorAll("a.action-button").forEach(link => {
            link.addEventListener("click", (e: Event) => {
                const href: string | null = (e.target as HTMLAnchorElement).getAttribute("href");
                if (href && href.startsWith("/profile")) {
                    e.preventDefault();
                    const router: ProfileRouterComponent = this.closest("profile-router") as ProfileRouterComponent;
                    if (router) {
                        router.navigate(href);
                    }
                }
            });
        });
    }
}

// Import type for router
interface ProfileRouterComponent extends HTMLElement {
    navigate(path: string): void;
}

window.customElements.define("profile-welcome", ProfileWelcomeComponent);

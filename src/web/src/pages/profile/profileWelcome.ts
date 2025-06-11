// src/pages/profile/profileWelcome.ts
import { html } from "@web/helpers/webComponents";
import { profileService } from "@web/services/profileService";
import { IUser } from "@shared/types";

interface ProfileRouterComponent extends HTMLElement {
    navigate(path: string): void;
}

interface LoadingComponent extends HTMLElement {
    show(): void;
    hide(): void;
}

export class ProfileWelcomeComponent extends HTMLElement {
    private user: IUser | null = null;
    private loadingComponent: LoadingComponent | null = null;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Create loading component
        this.loadingComponent = document.createElement("webshop-loading") as LoadingComponent;

        // Show loading
        this.showLoading();

        // Check authentication first
        const isAuthenticated: boolean = await profileService.checkAuth();

        if (!isAuthenticated) {
            this.hideLoading();
            this.showAuthError();
            return;
        }

        // Load user data
        await this.loadUserData();

        // Hide loading and render
        this.hideLoading();
        this.render();
    }

    private showLoading(): void {
        if (this.shadowRoot && this.loadingComponent) {
            this.shadowRoot.appendChild(this.loadingComponent);
            this.loadingComponent.show();
        }
    }

    private hideLoading(): void {
        if (this.loadingComponent) {
            this.loadingComponent.hide();
            this.loadingComponent.remove();
        }
    }

    private showAuthError(): void {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h2 style="color: #dc3545;">Niet ingelogd</h2>
                    <p>Je moet ingelogd zijn om je profiel te bekijken.</p>
                    <a href="/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #159eff; color: white; text-decoration: none; border-radius: 15px;">Inloggen</a>
                </div>
            `;
        }
    }

    private async loadUserData(): Promise<void> {
        try {
            this.user = await profileService.getCurrentUser();
        }
        catch (error: unknown) {
            console.error("Failed to load user data:", error);
            this.showErrorMessage();
        }
    }

    private showErrorMessage(): void {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #dc3545;">
                    <h2>Er is een fout opgetreden</h2>
                    <p>We konden je gegevens niet laden. Probeer het later opnieuw.</p>
                    <a href="/" style="color: #159eff;">Terug naar home</a>
                </div>
            `;
        }
    }

    private render(): void {
        if (!this.shadowRoot || !this.user) {
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

        const fullName: string = `${this.user.firstName} ${this.user.prefix ? this.user.prefix + " " : ""}${this.user.lastName}`;

        const element: HTMLElement = html`
            <div class="welcome-header">
                <h1>Welkom terug, ${fullName}!</h1>
                <p class="subtitle">Beheer je account en bekijk je activiteiten</p>
            </div>
            
            <div class="quick-actions">
                <h2>Snelle acties</h2>
                <div class="action-buttons">
                    <a href="/profile/account" class="action-button">Account bekijken</a>
                    <a href="/profile/account/edit" class="action-button secondary">Profiel bewerken</a>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add click handlers for navigation
        this.shadowRoot.querySelectorAll("a.action-button").forEach((link: Element) => {
            link.addEventListener("click", (e: Event) => {
                const href: string | null = (e.target as HTMLAnchorElement).getAttribute("href");
                if (href?.startsWith("/profile")) {
                    e.preventDefault();
                    const router: ProfileRouterComponent | null = this.closest("profile-router") as ProfileRouterComponent;
                    if (router) {
                        router.navigate(href);
                    }
                }
            });
        });
    }
}

window.customElements.define("profile-welcome", ProfileWelcomeComponent);

// src/components/profileRouter.ts
import { html } from "@web/helpers/webComponents";

interface Route {
    path: string;
    component: string;
    title?: string;
}

export class ProfileRouterComponent extends HTMLElement {
    private routes: Route[] = [
        { path: "/profile", component: "profile-welcome", title: "Welkom" },
        { path: "/profile/account", component: "profile-account", title: "Account" },
        { path: "/profile/account/edit", component: "profile-account-edit", title: "Account Bewerken" },
        { path: "/profile/reviews", component: "profile-reviews", title: "Mijn Reviews" },
    ];

    private currentRoute: string = "";

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Listen for popstate events (browser back/forward)
        window.addEventListener("popstate", () => this.handleRouteChange());

        // Handle initial route
        this.handleRouteChange();
    }

    public disconnectedCallback(): void {
        window.removeEventListener("popstate", () => this.handleRouteChange());
    }

    private handleRouteChange(): void {
        const path: string = window.location.pathname;
        const route: Route | undefined = this.findMatchingRoute(path);

        if (!route) {
            // Default to welcome page
            this.navigate("/profile");
            return;
        }

        if (this.currentRoute === route.path) {
            return;
        }

        this.currentRoute = route.path;
        this.render(route);
    }

    private findMatchingRoute(path: string): Route | undefined {
        // Exact match first
        let route: Route | undefined = this.routes.find(r => r.path === path);

        // If no exact match, try to find the closest parent route
        if (!route && path.startsWith("/profile")) {
            const segments: string[] = path.split("/");
            while (segments.length > 2 && !route) {
                segments.pop();
                const parentPath: string = segments.join("/");
                route = this.routes.find(r => r.path === parentPath);
            }
        }

        return route;
    }

    public navigate(path: string): void {
        window.history.pushState({}, "", path);
        this.handleRouteChange();
    }

    private render(route: Route): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
                
                .profile-container {
                    display: flex;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    gap: 20px;
                }
                
                .profile-sidebar {
                    width: 250px;
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .profile-content {
                    flex: 1;
                    background-color: #ffffff;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                .sidebar-nav {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .sidebar-nav li {
                    margin-bottom: 10px;
                }
                
                .sidebar-nav a {
                    display: block;
                    padding: 10px 15px;
                    text-decoration: none;
                    color: #333;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .sidebar-nav a:hover {
                    background-color: #e9ecef;
                }
                
                .sidebar-nav a.active {
                    background-color: #159eff;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .profile-container {
                        flex-direction: column;
                    }
                    
                    .profile-sidebar {
                        width: 100%;
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="profile-container">
                <aside class="profile-sidebar">
                    <nav>
                        <ul class="sidebar-nav">
                            <li><a href="/profile" class="${this.currentRoute === "/profile" ? "active" : ""}">Dashboard</a></li>
                            <li><a href="/profile/account" class="${this.currentRoute === "/profile/account" || this.currentRoute === "/profile/account/edit" ? "active" : ""}">Mijn Account</a></li>
                            <li><a href="/profile/reviews" class="${this.currentRoute === "/profile/reviews" ? "active" : ""}">Mijn Reviews</a></li>
                            <li><a href="/profile/orders">Mijn Bestellingen</a></li>
                            <li><a href="/profile/wishlist">Verlanglijst</a></li>
                        </ul>
                    </nav>
                </aside>
                <main class="profile-content">
                    <${route.component}></${route.component}>
                </main>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add click handlers to navigation links
        this.shadowRoot.querySelectorAll(".sidebar-nav a").forEach(link => {
            link.addEventListener("click", (e: Event) => {
                e.preventDefault();
                const href: string | null = (e.target as HTMLAnchorElement).getAttribute("href");
                if (href) {
                    this.navigate(href);
                }
            });
        });
    }
}

// Register the component
window.customElements.define("profile-router", ProfileRouterComponent);

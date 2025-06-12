import "@web/components/LayoutComponent";
import "@web/components/DashboardSidebarComponent";
import { html } from "@web/helpers/webComponents";
import { authService } from "@web/services/AuthService";
import { IUser } from "@shared/types";

export type DashboardButton = {
    title: string;
    icon?: string;
    action?: () => void;
};

export class DashboardComponent extends HTMLElement {
    private _pageTitle: string = "Dashboard";
    private _button: DashboardButton | undefined;

    public set pageTitle(title: string) {
        this._pageTitle = title;
    }

    public set pageButton(button: DashboardButton | undefined) {
        this._button = button;
    }

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        authService.getUser()
            .then((user: IUser | undefined) => {
                if (!user || user.role !== "admin") {
                    location.href = "/";
                    return;
                }

                this.render();
            })
            .catch(() => {
                location.href = "/";
            });
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .dashboard-container {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    gap: 1.5em;
                    margin: 1.5em 0;
                }

                .dashboard-content {
                    flex: 1;
                }

                .dashboard-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1em;
                }

                .dashboard-header h2 {
                    margin: 0;
                }

                .dashboard-header button {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.5em 1em;
                    border-radius: 0.25em;
                    cursor: pointer;
                    user-select: none;
                }

                .dashboard-header button:hover {
                    background-color: var(--primary-color-dark);
                }
            </style>
        `;

        const dashboardHeader: HTMLElement = html`
            <div class="dashboard-header">
                <h2>${this._pageTitle}</h2>
            </div>
        `;

        if (this._button) {
            const headerButton: HTMLElement = html`
                <button>
                    ${this._button.icon ? html`<img src="${this._button.icon}" alt="${this._button.title}-icon" />` : ""}
                    <span>${this._button.title}</span>
                </button>
            `;

            if (this._button.action) {
                headerButton.addEventListener("click", this._button.action);
            }

            dashboardHeader.appendChild(headerButton);
        }

        const element: HTMLElement = html`
            <div>
                <div class="dashboard-container">
                    <webshop-dashboard-sidebar></webshop-dashboard-sidebar>

                    <div class="dashboard-content">
                        ${dashboardHeader}

                        <slot></slot>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-dashboard", DashboardComponent);

import "@web/components/LayoutComponent";
import { html } from "@web/helpers/webComponents";

class DashboardSidebarComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .sidebar {
                    display: flex;
                    flex-direction: column;
                    width: 200px;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 15px;
                    text-decoration: none;
                    color: #333;
                    font-size: 16px;
                    gap: 6px;
                }

                .sidebar-item:hover {
                    background-color: #e0e0e0;
                }

                .icon {
                    width: 24px;
                    height: 24px;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="sidebar">
                <a href="/dashboard/index.html" class="sidebar-item">
                    <span class="icon">
                        <img src="/images/icons/home.svg" alt="Dashboard Icon">
                    </span>
                    <span class="label">Dashboard</span>
                </a>

                <a href="/dashboard/orders.html" class="sidebar-item">
                    <span class="icon">
                        <img src="/images/icons/package.svg" alt="Orders Icon">
                    </span>
                    <span class="label">Orders</span>
                </a>

                <a href="/dashboard/games.html" class="sidebar-item">
                    <span class="icon">
                        <img src="/images/icons/gamepad.svg" alt="Games Icon">
                    </span>
                    <span class="label">Games</span>
                </a>

                <a href="/dashboard/tags.html" class="sidebar-item">
                    <span class="icon">
                        <img src="/images/icons/tag.svg" alt="Tags Icon">
                    </span>
                    <span class="label">Tags</span>
                </a>

                <a href="/dashboard/users.html" class="sidebar-item">
                    <span class="icon">
                        <img src="/images/icons/account.svg" alt="Users Icon">
                    </span>
                    <span class="label">Gebruikers</span>
                </a>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-dashboard-sidebar", DashboardSidebarComponent);

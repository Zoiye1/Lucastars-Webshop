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
                }

                .sidebar-item:hover {
                    background-color: #e0e0e0;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="sidebar">
                <a href="/dashboard/" class="sidebar-item">
                    <span class="icon">🏠</span>
                    <span class="label">Dashboard</span>
                </a>

                <a href="/dashboard/orders" class="sidebar-item">
                    <span class="icon">📦</span>
                    <span class="label">Orders</span>
                </a>

                <a href="/dashboard/games" class="sidebar-item">
                    <span class="icon">🛒</span>
                    <span class="label">Games</span>
                </a>

                <a href="/dashboard/tags" class="sidebar-item">
                    <span class="icon">🛒</span>
                    <span class="label">Tags</span>
                </a>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-dashboard-sidebar", DashboardSidebarComponent);

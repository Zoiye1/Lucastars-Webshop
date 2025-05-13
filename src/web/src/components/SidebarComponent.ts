import { html } from "@web/helpers/webComponents";

export class SidebarComponent extends HTMLElement {
    private menuItems = [
        { icon: "user", text: "Mijn bol", active: true },
        { icon: "shopping-bag", text: "Bestellingen" },
        { icon: "file-invoice", text: "Facturen betalen" },
        { icon: "exchange", text: "Retourneren" },
        { icon: "comment", text: "Chat-geschiedenis" },
        { icon: "cog", text: "Gegevens & Voorkeuren" },
        { icon: "gift", text: "Cadeaubonnen" },
        { icon: "crown", text: "Mijn Select & Kobo Plus" },
        { icon: "tablet", text: "Digitale producten" },
        { icon: "tag", text: "Verkopen" },
        { icon: "sign-out", text: "Uitloggen" },
    ];

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
                    width: 250px;
                    padding: 1rem 0;
                }
                
                .sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    text-decoration: none;
                    color: #333;
                }
                
                .sidebar-item.active {
                    font-weight: bold;
                    color: #00116e;
                }
                
                .sidebar-item:hover {
                    background-color: #f5f5f5;
                }
                
                .icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .item-text {
                    font-size: 1rem;
                }
            </style>
        `;

        // Create sidebar items
        const sidebarElements = this.menuItems.map(item => {
            return html`
                <a class="sidebar-item ${item.active ? "active" : ""}">
                    <div class="icon">
                        <!-- Icon placeholder - would be replaced with actual icons -->
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
                        </svg>
                    </div>
                    <span class="item-text">${item.text}</span>
                </a>
            `;
        });

        // Combine all sidebar elements
        const sidebarHtml = sidebarElements.reduce((acc, curr) => {
            acc.appendChild(curr);
            return acc;
        }, document.createDocumentFragment());

        const element: HTMLElement = html`
            <div class="sidebar">
                ${sidebarHtml}
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-sidebar", SidebarComponent);

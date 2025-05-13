import "@web/components/LayoutComponent";
import "@web/components/ProfileBannerComponent";
import "@web/components/OrderHistoryComponent";
import "@web/components/SidebarComponent2";
import { html } from "@web/helpers/webComponents";

export class ProfilePageComponent extends HTMLElement {
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
                h1 {
                    font-size: 1.5rem;
                    margin: 1.5rem 0;
                    font-weight: normal;
                }
                
                .view-all {
                    display: flex;
                    align-items: center;
                    color: blue;
                    text-decoration: none;
                    margin: 1rem 0;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                
                .view-all::before {
                    content: "→";
                    display: inline-block;
                    margin-right: 0.5rem;
                    color: blue;
                }
                
                .main-content {
                    display: flex;
                    width: 100%;
                    gap: 2rem;
                }
                
                .content-area {
                    flex: 1;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-profile-banner username="Zoiye"></webshop-profile-banner>
                <h1>Je laatste bestellingen</h1>
                <webshop-order-history></webshop-order-history>
                <a class="view-all">Bekijk al je bestellingen</a>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-profile", ProfilePageComponent);

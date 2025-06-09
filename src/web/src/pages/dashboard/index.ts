import "@web/components/LayoutComponent";
import "@web/components/DashboardComponent";
import { html } from "@web/helpers/webComponents";

class DashboardIndexPageComponent extends HTMLElement {
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
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-dashboard>
                    Welkom op het dashboard!
                </webshop-dashboard>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-dashboard-index", DashboardIndexPageComponent);

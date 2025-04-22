import "@web/components/LayoutComponent";
import "@web/components/BannerComponent";
import "@web/components/TopGamesComponent";

import { html } from "@web/helpers/webComponents";

export class GamePageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-product-info></webshop-product-info>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-game", GamePageComponent);

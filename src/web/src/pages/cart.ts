import "@web/components/NavigationComponent";

import "@web/components/CartPageComponent";
import { html } from "@web/helpers/webComponents";

class CartPageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <webshop-navigation></webshop-navigation>
                <webshop-cartpage></webshop-cartpage>

            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-cart", CartPageComponent);

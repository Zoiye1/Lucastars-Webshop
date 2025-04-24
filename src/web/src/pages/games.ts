import "@web/components/LayoutComponent";
import "@web/components/GameListComponent";
import { html } from "@web/helpers/webComponents";

class GamesPageComponent extends HTMLElement {
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
                <h1>All onze games!</h1>

                <webshop-list-games></webshop-list-games>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-games", GamesPageComponent);

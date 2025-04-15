import "@web/components/HeaderComponent";
import "@web/components/FooterComponent";
import { html } from "@web/helpers/webComponents";

export class LayoutComponent extends HTMLElement {
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
                div.wrapper {
                    display: flex;
                    flex-direction: column;
                    min-height: 100dvh;
                }
                
                main {
                    flex-grow: 1;
                    max-width: var(--max-width);
                    width: 100%;
                    padding: 0 1em;
                    margin: 0 auto;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="wrapper">
                <webshop-header></webshop-header>

                <main>
                    <slot></slot>
                </main>

                <webshop-footer></webshop-footer>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-layout", LayoutComponent);

import "@web/components/HeaderComponent";
import "@web/components/FooterComponent";
import { html } from "@web/helpers/webComponents";

/**
 * This component is the main layout for the webshop.
 * It contains the header, footer and a slot for the main content.
 */
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
                    width: 100%;
                    padding: 0 1em;
                    box-sizing: border-box;
                }
                
                main {
                    display: flex;
                    flex-grow: 1;
                    max-width: var(--max-width);
                    width: 100%;
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                slot {
                    flex-grow: 1;
                    display: block;
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

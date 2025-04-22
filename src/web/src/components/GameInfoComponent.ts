import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class GameInfoComponent extends HTMLElement {
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
                .container {
                    background: green;
                    width: 100%;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="container">
                <header>
                    <h2></h2>
                    <div class="stars-container">
                        <div class="star"></div>
                    </div>
                </header>
                <div class="image-container">

                </div>
                <div class="game-info">
                    <p class="price"></p>
                    <p class="description"></p>
                    <div class="quantity-selector">
                        <div class="quantity"></div>
                    </div>
                    <div class="cart-button"></div>
                </div>
            </div>
        `;



        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-game-info", GameInfoComponent);

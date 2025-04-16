import { html } from "@web/helpers/webComponents";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class BannerComponent extends HTMLElement {
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
                #banner {
                    width: 100px;
                    height: 100px;
                    background: green;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <section id="banner">
                <div>
                    <button id="shop-now-button"></button>
                </div>
            </section>

        `;

        const shopNowButtonElement: HTMLElement = element.querySelector("#shop-now-button")!;

        shopNowButtonElement.addEventListener("click", () => {
            location.href = "/games.html";
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-banner", BannerComponent);

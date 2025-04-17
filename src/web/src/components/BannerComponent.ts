import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
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
                .banner {
                    margin: 38.5px 0;
                    width: 100%;
                    height: 350px;
                    background: #fffbfb;
                    border-radius: 30px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0px 0px 9px -4px black;
                }

                .banner header {
                    height: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 22px;
                }

                .banner .description {
                    height: 15%;
                    display: flex;
                    justify-content: center;
                }
                
                .banner .button {
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    height: 35%;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <section class="banner">
                <header><h1>Speel Direct. Geen Downloads Nodig.</h1></header>
                <div class="description">Toegang tot een groeiende collectie games — speel direct vanuit je browser.</div>
                <div class="button">
                    <webshop-link-button>Mijn spellen</webshop-link-button>
                    <webshop-link-button>Shop nu!</webshop-link-button>
                </div>
            </section>
        `;



        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-banner", BannerComponent);

import { html } from "@web/helpers/webComponents";
import "@web/components/GameSelectComponent";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class TopGamesComponent extends HTMLElement {
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
                .top-games {
                    width: 100%;
                    margin: 50px 0;
                    display: flex;
                    justify-content: space-evenly;
                }
            </style>
        `;
        const games: HTMLElement[] = [];
        for (let i: number = 0; i < 4; i++) {
            games.push(html`<webshop-select-game name="dark souls" image="dark-souls.jpg"></webshop-select-game>`);
        }
        const element: HTMLElement = html`
            <section class="top-games">
                ${games}
            </section>
        `;



        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-top-games", TopGamesComponent);

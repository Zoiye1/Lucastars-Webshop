import { html } from "@web/helpers/webComponents";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class GameSelectComponent extends HTMLElement {
    private _name: string = "";
    private _image: string = "";
    private _price: number = 0;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this._name = this.getAttribute("name") ?? "";
        this._image = this.getAttribute("image") ?? "";
        this._price = Number(this.getAttribute("price") ?? 0.00);
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .select-game-container {
                    box-shadow: 0px 0px 9px -4px black;
                    height: 230px;
                    width: 200px;
                    border-radius: 25px;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                a {
                    text-decoration: none;
                    color: black;
                }

                .game-img {
                    aspect-ratio: 9 / 5;
                    width: 100%;
                    overflow: hidden;
                    border-top-right-radius: 25px;
                    border-top-left-radius: 25px;
                }

                .game-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* crop to fill */
                    object-position: center; /* center the image */
                    display: block;
                }

                .game-title, .game-price {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    height: 39px;
                    font-size: 18px;
                    font-weight: bold;
                    align-items: center;
                }
                
                .game-price {
                    height: 30px;
                    margin-bottom: 9px;
                    font-size: 14px;
                    color: #e80000;
                }

                .add-button {
                    border: none;
                    border-radius: 20px;
                    width: 80%;
                    padding: 5px 0;
                    background: #159eff;
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                }

                .add-button:hover {
                    background: #138be1;
                }
            </style>
        `;
        const element: HTMLElement = html`
            <a href="/game.html?name=${this._name}">
                <article class="select-game-container">
                    <header class="game-img"><img src="${this._image}" /></header>
                    <p class="game-title">${this._name}</p>
                    <p class="game-price">€${this._price}</p>
                    <button class="add-button" id="add-button">
                        Winkelmand
                    </button>
                </article>
            </a>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-select-game", GameSelectComponent);

import { html } from "@web/helpers/webComponents";

export class NavigationComponent extends HTMLElement {
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
                nav {
                    display: flex;
                    gap: 16px;
                }

                nav a {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 0;
                    text-decoration: none;
                    color: black;
                }

                nav a:hover {
                    text-decoration: underline;
                }

                nav img {
                    height: 24px;
                    width: 24px;
                    user-select: none;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <nav>
                <a href="/index.html">
                    <img src="/assets/images/icons/gamepad.svg" alt="Gamepad icon" />
                    <span>Mijn spellen</span>
                </a>

                <a href="/index.html">
                    <img src="/assets/images/icons/account.svg" alt="Account icon" />
                    <span>Account</span>
                </a>

                <a href="/index.html">
                    <img src="/assets/images/icons/cart.svg" alt="Cart icon" />
                    <span>Winkelmand (0)</span>
                </a>

                <a href="/example.html">
                    <img src="/assets/images/icons/question.svg" alt="Question icon" />
                    <span>Example</span>
                </a>
            </nav>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-navigation", NavigationComponent);

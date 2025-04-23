import { html } from "@web/helpers/webComponents";

/**
 * This component is used to display the navigation bar.
 *
 * @remarks On mobile, the navigation bar will be offset by `var(--header-height)` from the top of the page.
 */
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

                .hamburger {
                    display: none;
                    cursor: pointer;
                    padding: 10px;
                }

                .hamburger img {
                    vertical-align: middle;
                }

                @media (max-width: 768px) {
                    nav {
                        display: none;
                    }

                    nav.active {
                        position: absolute;
                        top: var(--header-height);
                        left: 0;
                        display: flex;
                        flex-direction: column;
                        background-color: white;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 10px;
                        border-top: 1px solid var(--border-color);
                        border-bottom: 1px solid var(--border-color);
                    }

                    .hamburger {
                        display: block;
                    }
                }
            </style>
        `;

        const hamburgerButton: HTMLElement = html`
            <div class="hamburger">
                <img src="/assets/images/icons/hamburger-menu.svg" alt="Hamburger icon" />
            </div>
        `;

        const navigation: HTMLElement = html`
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

        hamburgerButton.addEventListener("click", () => {
            navigation.classList.toggle("active");
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, navigation, hamburgerButton);
    }
}

window.customElements.define("webshop-navigation", NavigationComponent);

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
                    text-decoration: none;
                    position: relative;
                    transition: all 0.3s ease;
                    transform: translateY(-3px);
                }

                nav a:hover {
                    transform: translateY(-3px);
                }

                nav a::before {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background-color: #d6d6d6;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.3s ease;
                }

                a:hover::before {
                    transform: scaleY(1);
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
                <img src="/images/icons/hamburger-menu.svg" alt="Hamburger icon" />
            </div>
        `;

        const navigation: HTMLElement = html`
            <nav>
                <a href="/my-games.html">
                    <img src="/images/icons/gamepad.svg" alt="Gamepad icon" />
                    <span>Mijn spellen</span>
                </a>

                <a href="/index.html">
                    <img src="/images/icons/account.svg" alt="Account icon" />
                    <span>Account</span>
                </a>

                <a href="/index.html">
                    <img src="/images/icons/cart.svg" alt="Cart icon" />
                    <span>Winkelmand (0)</span>
                </a>

                <a href="/login.html">
                    <span>Login</span>
                </a>
                <a href="/register.html">
                    <img src="/images/icons/question.svg" alt="Question icon" />
                    <span>Register</span>
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

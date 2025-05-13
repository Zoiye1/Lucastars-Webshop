import { html } from "@web/helpers/webComponents";

export class ProfileBannerComponent extends HTMLElement {
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
                .profile-banner {
                    background-color: #e8f5eb;
                    border-radius: 8px;
                    padding: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin: 1rem 0;
                }
                
                .profile-content {
                    display: flex;
                    flex-direction: column;
                }
                
                h1 {
                    font-size: 2.5rem;
                    margin: 0;
                    color: #00116e;
                    font-weight: bold;
                }
                
                p {
                    font-size: 1.1rem;
                    margin: 0.5rem 0 0 0;
                }
                
                .cart-image {
                    width: 150px;
                    height: 150px;
                    background-color: transparent;
                }
                
                .logo {
                    display: inline-block;
                    background-color: #00116e;
                    color: white;
                    font-weight: bold;
                    padding: 0.5rem 1rem;
                    border-radius: 18px;
                    margin-bottom: 1rem;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="profile-banner">
                <div class="profile-content">
                    <span class="logo">mijn bol</span>
                    <h1>Hallo ${username}</h1>
                    <p>Hier vind je jouw bestellingen, facturen, retouren en meer.</p>
                </div>
                <div class="cart-image">
                    <!-- Placeholder for cart image -->
                    <svg width="150" height="150" viewBox="0 0 150 150">
                        <rect width="80" height="80" x="35" y="35" rx="8" fill="#c3cde6" opacity="0.5" />
                        <circle cx="100" cy="100" r="40" fill="#8ba3e0" opacity="0.8" />
                    </svg>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-profile-banner", ProfileBannerComponent);

import { html } from "@web/helpers/webComponents";

export class OrderHistoryComponent extends HTMLElement {
    private orders = [
        {
            status: "Bezorgd",
            title: "CKB LTD - Bomb shots - Drank - Jagermeister Shotglaasjes Giftpack -",
            image: "/assets/images/placeholder-product-1.jpg",
        },
        {
            status: "Bezorgd",
            title: "Vivaloo - 50 stuks - Red Cups - Party Cups - 473 ML - Beer Pong -",
            image: "/assets/images/placeholder-product-2.jpg",
        },
        {
            status: "Bezorgd",
            title: "Drankspel - Haaien Tanden - Partyspel",
            image: "/assets/images/placeholder-product-3.jpg",
        },
    ];

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
                .order-container {
                    display: flex;
                    overflow-x: hidden;
                    gap: 1rem;
                    padding-bottom: 1rem;
                    width: 100%;
                    position: relative;
                }
                
                .order-placeholder {
                    min-width: 300px;
                    width: 300px;
                    min-height: 200px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-style: italic;
                }
                
                .navigation {
                    position: relative;
                }
                
                .nav-button {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                }
                
                .nav-button.prev {
                    left: -10px;
                }
                
                .nav-button.next {
                    right: -10px;
                }
                
                .nav-icon {
                    border: solid #333;
                    border-width: 0 2px 2px 0;
                    display: inline-block;
                    padding: 3px;
                    width: 6px;
                    height: 6px;
                }
                
                .nav-icon.right {
                    transform: rotate(-45deg);
                }
                
                .nav-icon.left {
                    transform: rotate(135deg);
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="navigation">
                <div class="nav-button prev">
                    <i class="nav-icon left"></i>
                </div>
                <div class="order-container">
                    <div class="order-placeholder">[object DocumentFragment]</div>
                </div>
                <div class="nav-button next">
                    <i class="nav-icon right"></i>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-order-history", OrderHistoryComponent);

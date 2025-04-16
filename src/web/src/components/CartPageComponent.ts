import { html } from "@web/helpers/webComponents";
import "@web/components/CartPageComponent";
export class CartPageComponent extends HTMLElement {
    private items: { name: string; price: number }[] = [];

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Example items (later replace with dynamic data or localStorage)
        this.items = [
            { name: "T-shirt", price: 19.99 },
            { name: "Cap", price: 9.99 },
        ];

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        // eslint-disable-next-line @typescript-eslint/typedef
        const total = this.items.reduce((sum, item) => sum + item.price, 0).toFixed(2);

        const element: HTMLElement = html`
            <section>
                <h2>Shopping Cart</h2>
                <ul>
                    
                    
                </ul>
                <p><strong>Total:</strong> €${total}</p>
            </section>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
    }
}

window.customElements.define("webshop-cartpage", CartPageComponent);

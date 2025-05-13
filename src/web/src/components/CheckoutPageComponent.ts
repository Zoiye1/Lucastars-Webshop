import { CheckoutItem } from "@shared/types";
import "@web/components/CheckoutPageComponent";
import { CheckoutService } from "@web/services/CheckoutService";

export class CheckoutPageComponent extends HTMLElement {
    private _checkoutService = new CheckoutService();

    private item?: CheckoutItem;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        try {
            this.item = await this._checkoutService.getCheckoutData();
            console.log(this.item);
        }
        catch (error) {
            console.error("Fout bij ophalen van checkoutgegevens:", error);
        }

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;
        if (!this.item) return;

        this.shadowRoot.innerHTML = "";

        // eslint-disable-next-line @typescript-eslint/typedef
        const container = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "2rem";

        // eslint-disable-next-line @typescript-eslint/typedef
        const userInfo = document.createElement("div");
        userInfo.innerHTML = `
            <h2>👤 Bezorginformatie</h2>
            <p><strong>Adres:</strong> ${this.item.street} ${this.item.houseNumber}, ${this.item.postalCode} ${this.item.city}</p>
            <p><strong>Totaal:</strong> €${this.item.totalPrice.toFixed(2)}</p>
        `;

        // eslint-disable-next-line @typescript-eslint/typedef
        const payment = document.createElement("div");
        payment.innerHTML = `
            <h2>💳 Betaalmethode</h2>
            <form id="payment-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <label><input type="radio" name="payment" value="ideal" checked /> iDEAL</label>
                <label><input type="radio" name="payment" value="creditcard" /> Creditcard</label>
                <label><input type="radio" name="payment" value="paypal" /> PayPal</label>
            </form>
        `;

        // eslint-disable-next-line @typescript-eslint/typedef
        const submitButton = document.createElement("button");
        submitButton.textContent = "Bestelling plaatsen";
        submitButton.style.padding = "0.75rem";
        submitButton.style.backgroundColor = "#007bff";
        submitButton.style.color = "white";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "8px";
        submitButton.style.fontSize = "1rem";
        submitButton.style.cursor = "pointer";
        submitButton.onclick = () => {
            alert("Bestelling geplaatst!");
            // eventueel data verzenden naar backend hier
        };

        container.appendChild(userInfo);
        container.appendChild(payment);
        container.appendChild(submitButton);

        this.shadowRoot.appendChild(container);
    }
}

window.customElements.define("webshop-checkoutpage", CheckoutPageComponent);

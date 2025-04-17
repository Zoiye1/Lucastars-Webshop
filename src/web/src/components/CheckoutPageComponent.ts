import "@web/components/CheckoutPageComponent";
import { html } from "@web/helpers/";

export class CheckoutPageComponent extends HTMLElement {
    private userData = {
        naam: "Jan Jansen",
        email: "jan@example.com",
        adres: "Dorpsstraat 1",
        postcode: "1234 AB",
        woonplaats: "Amsterdam"
    };

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const container = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";
        container.style.fontFamily = "sans-serif";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "2rem";

        // 🔹 Gebruikersgegevens als tekst
        const userInfo = document.createElement("div");
        userInfo.innerHTML = `
            <h2>👤 Jouw Gegevens</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li><strong>Naam:</strong> ${this.userData.naam}</li>
                <li><strong>Email:</strong> ${this.userData.email}</li>
                <li><strong>Adres:</strong> ${this.userData.adres}</li>
                <li><strong>Postcode:</strong> ${this.userData.postcode}</li>
                <li><strong>Woonplaats:</strong> ${this.userData.woonplaats}</li>
            </ul>
        `;

        // 🔹 Betaalmethode
        const payment = document.createElement("div");
        payment.innerHTML = `
            <h2>💳 Betaalmethode</h2>
            <form id="payment-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <label><input type="radio" name="payment" value="ideal" checked /> iDEAL</label>
                <label><input type="radio" name="payment" value="creditcard" /> Creditcard</label>
                <label><input type="radio" name="payment" value="paypal" /> PayPal</label>
            </form>
        `;

        // 🔘 Bestelling plaatsen knop
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
            // hier kun je nog data verzenden als je wil
        };

        container.appendChild(userInfo);
        container.appendChild(payment);
        container.appendChild(submitButton);

        this.shadowRoot.appendChild(container);
    }
}

window.customElements.define("webshop-checkoutpage", CheckoutPageComponent);

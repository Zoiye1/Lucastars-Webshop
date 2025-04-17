import { html } from "@web/helpers/";
import "@web/components/CheckoutPageComponent";
export class CheckoutPageComponent extends HTMLElement {
    private items: {
        name: string;
        price: number;
        quantity: number;
    }[] = [];

    private customer = {
        name: "",
        email: ""
    };

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        const savedItems = localStorage.getItem("cart-items");
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = "";
    
        const container = document.createElement("section");
        container.style.maxWidth = "600px";
        container.style.margin = "2rem auto";
        container.style.fontFamily = "sans-serif";
    
        const title = document.createElement("h2");
        title.textContent = "🧾 Afrekenen";
        title.style.textAlign = "center";
    
        container.appendChild(title);
    
        const form = document.createElement("form");
        form.onsubmit = (e) => {
            e.preventDefault();
            alert(`Bedankt voor je bestelling, ${this.customer.name}!`);
            localStorage.removeItem("cart-items");
            window.location.href = "/"; // Of een bedankpagina
        };
    
        const nameInput = this.createInput("Naam", "text", "name", (e) => {
            this.customer.name = (e.target as HTMLInputElement).value;
        });
    
        const emailInput = this.createInput("E-mail", "email", "email", (e) => {
            this.customer.email = (e.target as HTMLInputElement).value;
        });
    
        form.appendChild(nameInput);
        form.appendChild(emailInput);
    
        // Blok voor afleveradres
        const addressInput = this.createInput("Afleveradres", "text", "address", (e) => {
            // Hier kun je de adresgegevens opslaan als het nodig is
        });
    
        // Blok voor betaalmethode
        const paymentMethodSelect = this.createPaymentMethodSelect();
    
        form.appendChild(addressInput);
        form.appendChild(paymentMethodSelect);
    
        // Verwijder order summary en totaal
        // const orderSummary = document.createElement("ul");
        // orderSummary.style.listStyle = "none";
        // orderSummary.style.padding = "0";
        // 
        // this.items.forEach((item) => {
        //     const li = document.createElement("li");
        //     li.style.display = "flex";
        //     li.style.justifyContent = "space-between";
        //     li.style.padding = "0.5rem 0";
        //     li.style.borderBottom = "1px solid #ddd";
        // 
        //     li.innerHTML = `
        //         <span>${item.quantity}x ${item.name}</span>
        //         <span>€${(item.price * item.quantity).toFixed(2)}</span>
        //     `;
        // 
        //     orderSummary.appendChild(li);
        // });
        // 
        // const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // const totalEl = document.createElement("p");
        // totalEl.innerHTML = `<strong>Totaal:</strong> €${total.toFixed(2)}`;
        // totalEl.style.textAlign = "right";
        // totalEl.style.fontSize = "1.2rem";
        // totalEl.style.marginTop = "1rem";
    
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Bevestig bestelling";
        submitBtn.type = "submit";
        submitBtn.style.marginTop = "1rem";
        submitBtn.style.padding = "0.75rem 1.5rem";
        submitBtn.style.fontSize = "1rem";
        submitBtn.style.backgroundColor = "#007bff";
        submitBtn.style.color = "white";
        submitBtn.style.border = "none";
        submitBtn.style.borderRadius = "8px";
        submitBtn.style.cursor = "pointer";
    
        form.appendChild(submitBtn);
    
        container.appendChild(form);
    
        this.shadowRoot.appendChild(container);
    }
    
    private createPaymentMethodSelect(): HTMLElement {
        const wrapper = document.createElement("div");
        wrapper.style.marginBottom = "1rem";
    
        const label = document.createElement("label");
        label.textContent = "Betaalmethode";
        label.style.display = "block";
        label.style.marginBottom = "0.5rem";
    
        const select = document.createElement("select");
        select.name = "payment-method";
        select.required = true;
        select.style.width = "100%";
        select.style.padding = "0.5rem";
        select.style.border = "1px solid #ccc";
        select.style.borderRadius = "4px";
    
        const option1 = document.createElement("option");
        option1.value = "credit-card";
        option1.textContent = "Creditcard";
        select.appendChild(option1);
    
        const option2 = document.createElement("option");
        option2.value = "paypal";
        option2.textContent = "PayPal";
        select.appendChild(option2);
    
        const option3 = document.createElement("option");
        option3.value = "bank-transfer";
        option3.textContent = "Overschrijving";
        select.appendChild(option3);
    
        wrapper.appendChild(label);
        wrapper.appendChild(select);
    
        return wrapper;
    }
    

window.customElements.define("webshop-checkoutpage", CheckoutPageComponent);

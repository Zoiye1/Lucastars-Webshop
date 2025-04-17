import { html } from "@web/helpers/webComponents";
import "@web/components/CartPageComponent";

// src/components/CartPageComponent.ts
export class CartPageComponent extends HTMLElement {
    private items: {
        name: string;
        price: number;
        image: string;
        description: string;
        quantity: number;
    }[] = [];

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        const savedItems = localStorage.getItem("cart-items");
        if (savedItems) {
            this.items = JSON.parse(savedItems);
        }
        else {
            this.items = [
                {
                    name: "T-shirt",
                    price: 19.99,
                    image: "https://example.com/images/tshirt.jpg",
                    description: "Comfortabel katoenen T-shirt in verschillende maten.",
                    quantity: 1,
                },
                {
                    name: "Cap",
                    price: 9.99,
                    image: "https://example.com/images/cap.jpg",
                    description: "Stijlvolle pet, perfect voor zonnige dagen.",
                    quantity: 1,
                },
            ];
            this.saveToLocalStorage();
        }

        this.render();
    }

    private saveToLocalStorage(): void {
        localStorage.setItem("cart-items", JSON.stringify(this.items));
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        const container = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";
        container.style.fontFamily = "sans-serif";

        const title = document.createElement("h2");
        title.textContent = "🛒 Mijn Winkelmand";
        title.style.textAlign = "center";
        container.appendChild(title);

        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.padding = "0";

        this.items.forEach((item, index) => {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.background = "#fff";
            li.style.borderRadius = "12px";
            li.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            li.style.padding = "1rem";
            li.style.marginBottom = "1rem";
            li.style.alignItems = "center";

            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "8px";
            img.style.marginRight = "1rem";

            const details = document.createElement("div");
            details.style.flex = "1";

            const name = document.createElement("h3");
            name.textContent = item.name;
            name.style.margin = "0 0 0.25rem 0";

            const desc = document.createElement("p");
            desc.textContent = item.description;
            desc.style.margin = "0 0 0.5rem 0";
            desc.style.color = "#666";

            const price = document.createElement("p");
            price.innerHTML = `<strong>Prijs:</strong> €${item.price.toFixed(2)}`;
            price.style.margin = "0.25rem 0";

            const quantityDiv = document.createElement("div");
            quantityDiv.style.display = "flex";
            quantityDiv.style.alignItems = "center";
            quantityDiv.style.gap = "0.5rem";

            const btnMinus = document.createElement("button");
            btnMinus.textContent = "➖";
            btnMinus.onclick = () => this.updateQuantity(index, -1);

            const qty = document.createElement("span");
            qty.textContent = item.quantity.toString();

            const btnPlus = document.createElement("button");
            btnPlus.textContent = "➕";
            btnPlus.onclick = () => this.updateQuantity(index, 1);

            quantityDiv.appendChild(btnMinus);
            quantityDiv.appendChild(qty);
            quantityDiv.appendChild(btnPlus);

            details.appendChild(name);
            details.appendChild(desc);
            details.appendChild(price);
            details.appendChild(quantityDiv);

            const btnRemove = document.createElement("button");
            btnRemove.innerHTML = "🗑️";
            btnRemove.style.marginLeft = "1rem";
            btnRemove.style.background = "transparent";
            btnRemove.style.border = "none";
            btnRemove.style.fontSize = "1.5rem";
            btnRemove.style.cursor = "pointer";
            btnRemove.onclick = () => this.removeItem(index);

            li.appendChild(img);
            li.appendChild(details);
            li.appendChild(btnRemove);

            ul.appendChild(li);
        });

        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

        const totalEl = document.createElement("p");
        totalEl.innerHTML = `<strong>Totaal:</strong> €${total}`;
        totalEl.style.textAlign = "right";
        totalEl.style.fontSize = "1.2rem";

        const checkoutButton = document.createElement("button");
        checkoutButton.textContent = "Afrekenen";
        checkoutButton.style.marginTop = "1rem";
        checkoutButton.style.padding = "0.75rem 1.5rem";
        checkoutButton.style.fontSize = "1rem";
        checkoutButton.style.backgroundColor = "#28a745";
        checkoutButton.style.color = "white";
        checkoutButton.style.border = "none";
        checkoutButton.style.borderRadius = "8px";
        checkoutButton.style.cursor = "pointer";
        checkoutButton.onclick = () => {
            window.location.href = "/checkout.html"; // Pas dit pad aan als jouw router iets anders gebruikt
        };

        container.appendChild(ul);
        container.appendChild(totalEl);
        container.appendChild(checkoutButton);

        this.shadowRoot.appendChild(container);
    }

    private updateQuantity(index: number, change: number): void {
        this.items[index].quantity += change;
        if (this.items[index].quantity <= 0) {
            this.items.splice(index, 1);
        }
        this.saveToLocalStorage();
        this.render();
    }

    private removeItem(index: number): void {
        this.items.splice(index, 1);
        this.saveToLocalStorage();
        this.render();
    }
}

window.customElements.define("webshop-cartpage", CartPageComponent);

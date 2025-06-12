import { AddressLookupResponse, CheckoutItem } from "@shared/types";
import "@web/components/CheckoutPageComponent";
import { CheckoutService } from "@web/services/CheckoutService";
import { PostalCodeService } from "@web/services/PostalCodeService";

export class CheckoutPageComponent extends HTMLElement {
    private _checkoutService = new CheckoutService();
    private _postalCodeService = new PostalCodeService();

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

        const container: HTMLElement = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "2rem";

        // Professioneel gestylede invoervelden voor bezorgadres
        const userInfo: HTMLElement = document.createElement("div");
        userInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="/images/icons/account-outline.svg" alt="User Icon" />
                <h2>Bezorginformatie</h2>
            </div>
            <form id="address-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Postcode
                            <input 
                                type="text" 
                                name="postalCode" 
                                value="${this.item.postalCode ?? ""}" 
                                placeholder="1234 AB" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Huisnummer
                            <input 
                                type="text" 
                                name="houseNumber" 
                                value="${this.item.houseNumber ?? ""}" 
                                placeholder="Nr." 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                    <div style="flex: 1; display: flex; align-items: flex-end;">
                        <button type="button" id="lookup-address" style="padding: 0.5rem 1rem; margin-bottom: 0;">
                            Zoek adres
                        </button>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 2;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Straat
                            <input 
                                type="text" 
                                name="street" 
                                value="${this.item.street ?? ""}" 
                                placeholder="Straatnaam" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                                readonly
                            />
                        </label>
                    </div>
                    <div style="flex: 2;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Stad
                            <input 
                                type="text" 
                                name="city" 
                                value="${this.item.city ?? ""}" 
                                placeholder="Plaatsnaam" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                                readonly
                            />
                        </label>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Totaal:</strong> <span style= "color: red;">€${this.item.totalPrice.toFixed(2)}</span></p>
            </form>
        `;
        const payment: HTMLElement = document.createElement("div");
        payment.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="/images/icons/payment.svg" alt="User Icon" />
                <h2>Betaalmethode</h2>
            </div>
            <form id="payment-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <label><input type="radio" name="payment" value="ideal" checked /> iDEAL</label>
                <label><input type="radio" name="payment" value="creditcard" /> Creditcard</label>
                <label><input type="radio" name="payment" value="paypal" /> PayPal</label>
            </form>
        `;

        const submitButton: HTMLButtonElement = document.createElement("button");
        submitButton.type = "submit";
        submitButton.setAttribute("form", "address-form");
        submitButton.textContent = "Bestelling plaatsen";
        submitButton.style.padding = "0.75rem";
        submitButton.style.backgroundColor = "var(--primary-color)";
        submitButton.style.color = "white";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "8px";
        submitButton.style.fontSize = "1rem";
        submitButton.style.cursor = "pointer";

        userInfo.querySelector<HTMLFormElement>("#address-form")!.onsubmit = async (event: SubmitEvent) => {
            event.preventDefault();

            const addressForm: HTMLFormElement | null = event.target as HTMLFormElement | null;

            if (addressForm) {
                const formData: FormData = new FormData(addressForm);
                const street: string = formData.get("street") as string;
                const houseNumber: string = formData.get("houseNumber") as string;
                const postalCode: string = formData.get("postalCode") as string;
                const city: string = formData.get("city") as string;

                if (!street || !city) {
                    alert("Zoek eerst het adres op.");
                    return;
                }

                const data: CheckoutItem = {
                    street: street,
                    houseNumber: houseNumber,
                    postalCode: postalCode,
                    city: city,
                    totalPrice: this.item!.totalPrice,
                };

                await this._checkoutService.submitCheckout(data);
                location.href = "/my-games.html";
            }
            else {
                alert("Vul het adres in.");
            }
        };

        container.appendChild(userInfo);
        container.appendChild(payment);
        container.appendChild(submitButton);

        this.shadowRoot.appendChild(container);

        const addressForm: HTMLFormElement | null = this.shadowRoot.querySelector("#address-form");
        const lookupBtn: HTMLButtonElement | null = this.shadowRoot.querySelector("#lookup-address");

        if (lookupBtn && addressForm) {
            lookupBtn.onclick = async () => {
                const formData: FormData = new FormData(addressForm);
                const postalCode: string = formData.get("postalCode") as string;
                const houseNumber: string = formData.get("houseNumber") as string;

                if (!postalCode || !houseNumber) {
                    alert("Vul postcode en huisnummer in.");
                    return;
                }

                const addressLookup: AddressLookupResponse = await this._postalCodeService.getAddressByPostalCode(postalCode, houseNumber);

                if (!addressLookup.street || !addressLookup.city) {
                    alert("Adres niet gevonden.");
                    return;
                }

                // Vul de straat en stad in het formulier
                (addressForm.elements.namedItem("street") as HTMLInputElement).value = addressLookup.street;
                (addressForm.elements.namedItem("city") as HTMLInputElement).value = addressLookup.city;
            };
        }
    }
}

window.customElements.define("webshop-checkoutpage", CheckoutPageComponent);

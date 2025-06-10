import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { CheckoutService } from "@web/services/CheckoutService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class PaymentReturnComponent extends HTMLElement {
    private _checkoutService: CheckoutService = new CheckoutService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        await this._checkoutService.getPaymentStatus();

        // Now continue rendering actual content after data has arrived
        const styles: HTMLElement = html`
            <style>
                section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .payment-status-container {
                    margin-top: 80px;
                    width: 500px;
                    height: 263px;
                    box-shadow: 0px 0px 9px -4px black;
                    border-radius: 30px;
                    
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                
                h1 {
                    font-size: 40px;
                    text-align: center;
                    color: green;
                }

                .link-button {
                    font-size: 25px;
                    border: none;
                    background: var(--primary-color);
                    color: white;
                    padding: 5px 0;
                    border-radius: 15px;
                    font-weight: bold;
                    width: 220px;
                    margin: 10px;
                    text-align: center;
                }

                .link-button:hover {
                    background: var(--primary-color-dark);
                }
                
            </style>
        `;

        const element: HTMLElement = html`
            <section>
                <div class="payment-status-container">
                    <h1>Betaling gelukt!</h1>
                    <a><div class="link-button" id="my-games-button">Mijn spellen</div></a>
                </div>
            </section>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-payment-return", PaymentReturnComponent);

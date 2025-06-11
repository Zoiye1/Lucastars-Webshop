import { Order } from "@shared/types";
import { html } from "@web/helpers/webComponents";

/**
 * This component displays detailed information about a users ordered items.
 */
export class OrderItemsInfoModalComponent extends HTMLElement {
    private _modal: HTMLDialogElement = document.createElement("dialog");
    private _order?: Order;

    public connectedCallback(): void {
        const shadowRoot: ShadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(this._modal);

        this._modal.addEventListener("click", (event: MouseEvent) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target === this._modal || target.id === "close-button") {
                this.closeModal();
            }
        });
    }

    public showModal(order: Order): void {
        this._order = order;
        this.render();
        this._modal.showModal();
    }

    public closeModal(): void {
        this._order = undefined;
        this._modal.close();
    }

    private formatPrice(price: number): string {
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
        }).format(price);
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        if (!this._order) {
            this._modal.innerHTML = "<p>Geen bestelde items gevonden.</p>";
            return;
        }

        const styles: HTMLElement = html`
            <style>
                 dialog {
                    padding: 0;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    max-width: 600px;
                    width: 90%;
                }

                dialog::backdrop {
                    background: rgba(0, 0, 0, 0.5);
                }

                .order-items-modal {
                    padding: 20px;
                }

                header h1 {
                    margin: 0 0 20px 0;
                    color: #333;
                    text-align: center;
                }

                p {
                    line-height: 1.5;
                    color: #666;
                }

                .description {
                    margin: 20px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }

                th, td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #e0e0e0;
                }

                th {
                    background: #f5f5f5;
                    font-weight: bold;
                    color: #333;
                }

                td img {
                    width: 40px;
                    height: 40px;
                    border-radius: 4px;
                    object-fit: cover;
                }

                .game-name {
                    font-weight: bold;
                    color: #333;
                }

                .game-id {
                    font-size: 12px;
                    color: #999;
                }

                .price {
                    font-weight: bold;
                    color: #159eff;
                    text-align: right;
                }

                .total-section {
                    padding-top: 15px;
                    margin-top: 20px;
                    text-align: right;
                }

                .total-price {
                    font-size: 18px;
                    font-weight: bold;
                    color: #159eff;
                }

                button, a {
                    padding: 10px 20px;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                }

                .button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }

                #close-button {
                    background: #159eff;
                }

                #close-button:hover {
                    background: #138be1;
                }
            </style>
        `;

        const itemsHtml: string = `
            <table>
                <thead>
                    <tr>
                        <th>Spel</th>
                        <th>Naam</th>
                        <th>Game ID</th>
                        <th>Prijs</th>
                    </tr>
                </thead>
                <tbody>
                    ${this._order.items.map(item => `
                        <tr>
                            <td><img src="${VITE_API_URL}uploads/${item.thumbnail}" alt="${item.name}" /></td>
                            <td>
                                <div class="game-name">${item.name}</div>
                            </td>
                            <td>
                                <div class="game-id">${item.gameId}</div>
                            </td>
                            <td class="price">${this.formatPrice(item.price)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        const element: HTMLElement = html`
            <div class="order-items-modal">
                <header>
                    <h1>Bestelde Items</h1>
                </header>
                <main>
                    <div class="description">
                        <p><strong>Aantal items:</strong> ${this._order.items.length}</p>
                        <p><strong>Gebruiker ID:</strong> ${this._order.user.id || "Onbekend"}</p>
                    </div>

                    <div class="items-container">
                        ${itemsHtml}
                    </div>

                    <div class="total-section">
                        <p class="total-price"><strong>Totaal: ${this.formatPrice(this._order.totalAmount)}</strong></p>
                    </div>

                    <div class="button-container">
                        <button id="close-button">Sluiten</button>
                    </div>
                </main>
            </div>
        `;

        this._modal.innerHTML = "";
        this._modal.append(styles, element);
    }
}

window.customElements.define("order-items-info-modal", OrderItemsInfoModalComponent);

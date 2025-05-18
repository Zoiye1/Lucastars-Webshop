import { html } from "@web/helpers/webComponents";
import "@web/components/GameSelectComponent";
import { OrdersGamesService } from "@web/services/OrdersGamesService";
import { ICartResponse, OrdersGames } from "@shared/types";
import { ICartService } from "@web/interfaces/ICartService";
import { CartService } from "@web/services/CartService";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class TopGamesComponent extends HTMLElement {
    private _ordersGamesService: OrdersGamesService = new OrdersGamesService();
    private cartService: ICartService = new CartService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const ordersGames: OrdersGames[] = await this._ordersGamesService.getOrdersGames();

        // Use the OrdersGames type directly
        const games: { gameId: number; name: string; thumbnail: string; price: number }[] = this.getTopGames(ordersGames, 5);

        const styles: HTMLElement = html`
            <style>
                .top-games {
                    width: 100%;
                    margin: 50px 0;
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                }

                #message-container {
                    display: none;
                    width: 100%;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    pointer-events: none;
                    justify-content: end;
                }

                #message {
                    transition: 0.3s;
                    height: 50px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                    border-radius: 15px;
                    position: relative;
                    top: 68px;
                }
            </style>
        `;

        const gameElements: HTMLElement[] = games.map(game => {
            const gameElement: HTMLElement = html`
                <webshop-select-game
                    gameId="${game.gameId}"
                    name="${game.name}"
                    image="${game.thumbnail}"
                    price="${game.price}">
                </webshop-select-game>
            `;

            gameElement.addEventListener("add-to-cart", async event => {
                const customEvent: CustomEvent = event as CustomEvent;
                const { gameId } = customEvent.detail as { gameId: number };

                const cartResponse: ICartResponse = await this.cartService.createCart({ gameId: gameId, quantity: 1 });
                if (cartResponse.success) {
                    this.showPopup(
                        "Toegevoegd aan de winkelmand",
                        "success"
                    );
                }
                else {
                    this.showPopup(
                        "Je bent niet ingelogd",
                        "warning"
                    );
                }
            });

            return gameElement; // ← important!
        });

        const element: HTMLElement = html`
            <section class="top-games">
                <div id="message-container">
                    <p id="message"></p>
                </div>
                ${gameElements}
            </section>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private getTopGames(purchases: OrdersGames[], topN: number = 5): { gameId: number; name: string; thumbnail: string; price: number }[] {
        const seenPairs: Set<string> = new Set();
        const gameMap: Map<number, { userId: number; name: string; thumbnail: string; price: number; users: Set<number> }> = new Map();

        for (const { gameId, userId, name, thumbnail, price } of purchases) {
            const key: string = `${userId}-${gameId}`;
            if (seenPairs.has(key)) continue;

            seenPairs.add(key);

            if (!gameMap.has(gameId)) {
                gameMap.set(gameId, {
                    userId,
                    name,
                    thumbnail,
                    price: price,
                    users: new Set(),
                });
            }

            gameMap.get(gameId)!.users.add(userId);
        }

        const topGames: { gameId: number; name: string; thumbnail: string; price: number }[] = Array.from(gameMap.entries())
            .map(([gameId, { name, thumbnail, price }]) => ({
                gameId,
                name,
                thumbnail,
                price,
            }))
            .slice(0, topN);

        return topGames;
    }

    private showPopup(message: string, type: string = "warning"): void {
        const messageContainerElement: HTMLElement = this.shadowRoot!.querySelector("#message-container")!;
        const messageElement: HTMLElement = this.shadowRoot!.querySelector("#message")!;

        // Reset position & show container
        messageElement.style.right = "-200px";
        messageContainerElement.style.display = "flex";

        // Slide in after a tiny delay to trigger CSS transition
        setTimeout(() => {
            messageElement.style.right = "18px";
        }, 20);

        // Set message and background color
        messageElement.innerHTML = message;
        switch (type) {
            case "success":
                messageElement.style.backgroundColor = "#159eff";
                break;
            case "warning":
                messageElement.style.backgroundColor = "orange";
                break;
            case "error":
                messageElement.style.backgroundColor = "red";
                break;
        }

        // Auto-hide after 4 seconds
        setTimeout(() => {
            messageElement.style.right = "-400px";

            setTimeout(() => {
                messageContainerElement.style.display = "none";
            }, 300);
        }, 2000);
    }
}

window.customElements.define("webshop-top-games", TopGamesComponent);

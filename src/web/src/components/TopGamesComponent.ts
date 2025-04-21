import { html } from "@web/helpers/webComponents";
import "@web/components/GameSelectComponent";
import { OrdersGamesService } from "@web/services/OrdersGamesService";
import { OrdersGames } from "@shared/types";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class TopGamesComponent extends HTMLElement {
    private _ordersGamesService: OrdersGamesService = new OrdersGamesService();

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
        const games: { gameId: number; name: string; thumbnail: string; price: number; uniqueBuyers: number }[] = this.getTopGames(ordersGames);

        const styles: HTMLElement = html`
            <style>
                .top-games {
                    width: 100%;
                    margin: 50px 0;
                    display: flex;
                    justify-content: space-evenly;
                }
            </style>
        `;

        const gameElements: HTMLElement[] = [];
        for (let i: number = 0; i < 4; i++) {
            if (games[i]) {
                gameElements.push(
                    html`<webshop-select-game
                        name="${games[i].name}"
                        image="${games[i].thumbnail}"
                        price="${games[i].price}">
                        
                    </webshop-select-game>`
                );
            }
        }

        const element: HTMLElement = html`
            <section class="top-games">
                ${gameElements}
            </section>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private getTopGames(purchases: OrdersGames[], topN: number = 4): { gameId: number; name: string; thumbnail: string; price: number; uniqueBuyers: number }[] {
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

        const topGames: { gameId: number; name: string; thumbnail: string; price: number; uniqueBuyers: number }[] = Array.from(gameMap.entries())
            .map(([gameId, { name, thumbnail, price, users }]) => ({
                gameId,
                name,
                thumbnail,
                price,
                uniqueBuyers: users.size,
            }))
            .sort((a, b) => b.uniqueBuyers - a.uniqueBuyers)
            .slice(0, topN);

        return topGames;
    }
}

window.customElements.define("webshop-top-games", TopGamesComponent);

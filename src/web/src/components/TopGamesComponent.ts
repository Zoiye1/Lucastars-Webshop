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
        const games: { gameId: number; name: string; thumbnail: string; price: number }[] = this.getTopGames(ordersGames, 5);

        const styles: HTMLElement = html`
            <style>
                .top-games {
                    width: 100%;
                    margin: 50px 0;
                    display: flex;
                    justify-content: space-between;
                }
            </style>
        `;

        const gameElements: HTMLElement[] = games.map(game => {
            return html`
                <webshop-select-game
                    gameId="${game.gameId}"
                    name="${game.name}"
                    image="${game.thumbnail}"
                    price="${game.price}">
                </webshop-select-game>
            `;
        });

        const element: HTMLElement = html`
            <section class="top-games">
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
}

window.customElements.define("webshop-top-games", TopGamesComponent);

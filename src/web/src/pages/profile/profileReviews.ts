// src/pages/profile/profileReviews.ts
import { html } from "@web/helpers/webComponents";
import { authService } from "@web/services/AuthService";

interface Review {
    id: number;
    gameId: number;
    gameName: string;
    gameThumbnail: string;
    rating: number;
    title: string;
    content: string;
    created: Date;
    helpful: number;
}

export class ProfileReviewsComponent extends HTMLElement {
    private reviews: Review[] = [];
    private loadingComponent: LoadingComponent | null = null;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        // Check if user is logged in
        const isLoggedIn: boolean = await authService.isLoggedIn();
        if (!isLoggedIn) {
            window.location.href = "/login.html";
            return;
        }

        // Create loading component
        this.loadingComponent = document.createElement("webshop-loading") as LoadingComponent;

        // Load reviews
        await this.loadReviews();
        this.render();
    }

    private async loadReviews(): Promise<void> {
        try {
            // This would normally fetch from your API
            // For now, using dummy data
            this.reviews = [
                {
                    id: 1,
                    gameId: 101,
                    gameName: "The Legend of Zelda: Tears of the Kingdom",
                    gameThumbnail: "/assets/images/zelda-totk.jpg",
                    rating: 5,
                    title: "Een meesterwerk!",
                    content: "Dit is zonder twijfel een van de beste games die ik ooit heb gespeeld. De vrijheid die je krijgt om de wereld te verkennen is ongekend.",
                    created: new Date("2024-11-20"),
                    helpful: 42,
                },
                {
                    id: 2,
                    gameId: 102,
                    gameName: "Hogwarts Legacy",
                    gameThumbnail: "/assets/images/hogwarts-legacy.jpg",
                    rating: 4,
                    title: "Magische ervaring",
                    content: "Als Harry Potter fan is dit een droom die uitkomt. De sfeer is perfect en er is zoveel te ontdekken. Alleen de combat wordt na een tijdje wat repetitief.",
                    created: new Date("2024-10-15"),
                    helpful: 28,
                },
                {
                    id: 3,
                    gameId: 103,
                    gameName: "Baldur's Gate 3",
                    gameThumbnail: "/assets/images/bg3.jpg",
                    rating: 5,
                    title: "RPG van het decennium",
                    content: "De hoeveelheid keuzes en de impact daarvan is verbazingwekkend. Elk gesprek, elke actie heeft gevolgen. Dit zet een nieuwe standaard voor RPG's.",
                    created: new Date("2024-09-05"),
                    helpful: 67,
                },
            ];
        }
        catch (error) {
            console.error("Failed to load reviews:", error);
            this.reviews = [];
        }
    }

    private renderStars(rating: number): string {
        const fullStars: number = Math.floor(rating);
        const emptyStars: number = 5 - fullStars;

        let stars: string = "";
        for (let i: number = 0; i < fullStars; i++) {
            stars += "<span class=\"star filled\">★</span>";
        }
        for (let i: number = 0; i < emptyStars; i++) {
            stars += "<span class=\"star\">☆</span>";
        }

        return stars;
    }

    private formatDate(date: Date): string {
        return new Intl.DateTimeFormat("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                    display: block;
                }
                
                .reviews-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                h1 {
                    color: #333;
                    margin: 0;
                }
                
                .review-count {
                    color: #666;
                    font-size: 16px;
                }
                
                .reviews-list {
                    display: grid;
                    gap: 20px;
                }
                
                .review-card {
                    background-color: #f8f9fa;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .review-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                .review-header {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 15px;
                }
                
                .game-thumbnail {
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    object-fit: cover;
                    background-color: #ddd;
                }
                
                .review-info {
                    flex: 1;
                }
                
                .game-name {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                }
                
                .review-meta {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-size: 14px;
                    color: #666;
                }
                
                .stars {
                    display: flex;
                    gap: 2px;
                }
                
                .star {
                    color: #ddd;
                    font-size: 16px;
                }
                
                .star.filled {
                    color: #ecae20;
                }
                
                .review-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin: 15px 0 10px 0;
                }
                
                .review-content {
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                
                .review-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    border-top: 1px solid #e9ecef;
                }
                
                .helpful-count {
                    font-size: 14px;
                    color: #666;
                }
                
                .review-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .action-button {
                    padding: 6px 12px;
                    font-size: 14px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .edit-button {
                    background-color: #159eff;
                    color: white;
                }
                
                .edit-button:hover {
                    background-color: #0078cd;
                }
                
                .delete-button {
                    background-color: #dc3545;
                    color: white;
                }
                
                .delete-button:hover {
                    background-color: #c82333;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background-color: #f8f9fa;
                    border-radius: 15px;
                }
                
                .empty-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    fill: #ddd;
                }
                
                .empty-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .empty-text {
                    color: #666;
                    margin-bottom: 20px;
                }
                
                .cta-button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #159eff;
                    color: white;
                    text-decoration: none;
                    border-radius: 15px;
                    transition: background-color 0.3s ease;
                }
                
                .cta-button:hover {
                    background-color: #0078cd;
                }
            </style>
        `;

        const reviewsContent: HTMLElement = this.reviews.length > 0
            ? html`
            <div class="reviews-list">
                ${this.reviews.map(review => html`
                    <div class="review-card">
                        <div class="review-header">
                            <img class="game-thumbnail" src="${review.gameThumbnail}" alt="${review.gameName}" 
                                 onerror="this.style.display='none'">
                            <div class="review-info">
                                <div class="game-name">${review.gameName}</div>
                                <div class="review-meta">
                                    <div class="stars">${this.renderStars(review.rating)}</div>
                                    <span>${this.formatDate(review.created)}</span>
                                </div>
                            </div>
                        </div>
                        <h3 class="review-title">${review.title}</h3>
                        <p class="review-content">${review.content}</p>
                        <div class="review-footer">
                            <span class="helpful-count">${review.helpful} mensen vonden dit nuttig</span>
                            <div class="review-actions">
                                <button class="action-button edit-button" data-id="${review.id}">Bewerken</button>
                                <button class="action-button delete-button" data-id="${review.id}">Verwijderen</button>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
        `
            : html`
            <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h2 class="empty-title">Nog geen reviews</h2>
                <p class="empty-text">Je hebt nog geen reviews geplaatst. Deel je mening over je favoriete games!</p>
                <a href="/games.html" class="cta-button">Bekijk games</a>
            </div>
        `;

        const element: HTMLElement = html`
            <div class="reviews-header">
                <h1>Mijn Reviews</h1>
                <span class="review-count">${this.reviews.length} review${this.reviews.length !== 1 ? "s" : ""}</span>
            </div>
            ${reviewsContent}
        `;

        this.shadowRoot.innerHTML = "";

        // Fix the innerHTML assignment for stars
        const tempDiv: HTMLDivElement = document.createElement("div");
        tempDiv.appendChild(styles);
        tempDiv.appendChild(element);

        // Now fix the stars HTML
        tempDiv.querySelectorAll(".stars").forEach(starsContainer => {
            const rating: number = parseInt(starsContainer.getAttribute("data-rating") || "0");
            starsContainer.innerHTML = this.renderStars(rating);
        });

        this.shadowRoot.append(...Array.from(tempDiv.children));

        // Add event listeners
        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (!this.shadowRoot) {
            return;
        }

        // Edit buttons
        this.shadowRoot.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", (e: Event) => {
                const reviewId: string | null = (e.target as HTMLElement).getAttribute("data-id");
                console.log("Edit review:", reviewId);
                // Here you would navigate to edit page or show edit modal
            });
        });

        // Delete buttons
        this.shadowRoot.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async (e: Event) => {
                const reviewId: string | null = (e.target as HTMLElement).getAttribute("data-id");
                if (confirm("Weet je zeker dat je deze review wilt verwijderen?")) {
                    console.log("Delete review:", reviewId);
                    // Here you would make API call to delete
                    // Then reload the reviews
                }
            });
        });
    }
}

// Import type
interface LoadingComponent extends HTMLElement {
    show(): void;
    hide(): void;
}

window.customElements.define("profile-reviews", ProfileReviewsComponent);

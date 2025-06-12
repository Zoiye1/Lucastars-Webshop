import { IUser } from "@shared/types";
import { html } from "@web/helpers/webComponents";

/**
 * This component displays detailed user information in a modal dialog.
 */
export class UserInfoModalComponent extends HTMLElement {
    private _modal: HTMLDialogElement = document.createElement("dialog");
    private _user?: IUser;

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

    public showModal(user: IUser): void {
        this._user = user;
        this.render();
        this._modal.showModal();
    }

    public closeModal(): void {
        this._user = undefined;
        this._modal.close();
    }

    private formatFullName(user: IUser): string {
        const parts: string[] = [user.firstName, user.prefix, user.lastName].filter(part => part !== null);
        return parts.join(" ").trim();
    }

    private formatAddress(user: IUser): string {
        const addressParts: string[] = [];

        if (user.street && user.houseNumber) {
            addressParts.push(`${user.street} ${user.houseNumber}`);
        }

        if (user.postalCode && user.city) {
            addressParts.push(`${user.postalCode} ${user.city}`);
        }

        if (user.country) {
            addressParts.push(user.country);
        }

        return addressParts.join(", ") || "Geen adres beschikbaar";
    }

    private formatDate(date: Date): string {
        return new Intl.DateTimeFormat("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        if (!this._user) {
            this._modal.innerHTML = "<p>Geen gebruiker geselecteerd.</p>";
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

                .user-info-modal {
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

        const fullName: string = this.formatFullName(this._user);
        const address: string = this.formatAddress(this._user);

        const element: HTMLElement = html`
            <div class="user-info-modal">
                <header>
                    <h1>Gebruikers informatie</h1>
                </header>
                <main>
                    <div class="description">
                        <p><strong>Gebruikers ID:</strong> ${this._user.id}</p>
                        <p><strong>Gebruikersnaam:</strong> ${this._user.username}</p>
                        <p><strong>Volledige naam:</strong> ${fullName}</p>
                        <p><strong>Email:</strong> ${this._user.email}</p>
                        
                        ${this._user.street || this._user.houseNumber || this._user.postalCode || this._user.city || this._user.country
? `
                            <p><strong>Adres:</strong> ${address}</p>
                        `
: ""}
                        
                        <p><strong>Geregistreerd op:</strong> ${this.formatDate(this._user.created)}</p>
                        <p><strong>Rol:</strong> ${this._user.role || "gebruiker"}</p>
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

window.customElements.define("user-info-modal", UserInfoModalComponent);

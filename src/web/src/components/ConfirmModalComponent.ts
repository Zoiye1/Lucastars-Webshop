import { html } from "@web/helpers/webComponents";

export class ConfirmModalComponent extends HTMLElement {
    public onConfirm?: () => Promise<void> | void;

    private _modal: HTMLDialogElement = document.createElement("dialog");

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

    public showModal(title: string, text: string): void {
        this.render(title, text);
        this._modal.showModal();
    }

    public closeModal(): void {
        this._modal.close();
    }

    private render(title: string, text: string): void {
        if (!this.shadowRoot) {
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

                div.modal {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                h2 {
                    text-align: center;
                    margin: 0;
                }

                .content {
                    margin: 20px 0;
                }

                .actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .actions button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    background-color: var(--primary-color);
                    color: white;
                    cursor: pointer;
                }

                .actions button:hover {
                    background-color: var(--primary-color-dark);
                }

                .actions button[type="button"] {
                    background-color: #6c757d;
                }

                .actions button[type="button"]:hover {
                    background-color: #5a6268;
                }
            </style>
        `;

        const confirmButton: HTMLButtonElement = html`
            <button type="submit">Ja</button>
        ` as HTMLButtonElement;

        const element: HTMLFormElement = html`
            <div class="modal">
                <h2>${title}</h2>

                <div class="content">
                    <p>${text}</p>
                </div>

                <div class="actions">
                    <button type="button" id="close-button">Nee</button>
                    ${confirmButton}
                </div>
            </div>
        ` as HTMLFormElement;

        confirmButton.addEventListener("click", async () => {
            this.closeModal();
            await this.onConfirm?.();
        });

        this._modal.innerHTML = "";
        this._modal.append(styles, element);
    }
}

window.customElements.define("webshop-confirm-modal", ConfirmModalComponent);

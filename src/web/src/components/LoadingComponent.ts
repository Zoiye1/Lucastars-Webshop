import { html } from "@web/helpers/webComponents";

export class LoadingComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 20px;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 10px;
                }
                
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="loading-container">
                <div class="spinner"></div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }

    public show(): void {
        this.style.display = "flex";
    }

    public hide(): void {
        this.style.display = "none";
    }
}

window.customElements.define("webshop-loading", LoadingComponent);

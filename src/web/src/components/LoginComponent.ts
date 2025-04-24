import { html } from "@web/helpers/webComponents";

export class LoginComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div class="register-form">
                <h2>Login</h2>
                <div id="error-message" class="error-message" style="display: none;"></div>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email: <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                
                    
                    <div class="form-group">
                        <label for="password">Password: <span class="required">*</span></label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <div class="form-group">
                        <button type="submit" id="submit-button">Login</button>
                    </div>

                    <div class="form-group">
                        <p>Don't have an account? Register <a href = "/register.html" >here</a>.</p>
                    </div>
                </form>
            </div>
        `;

        const styles: HTMLElement = html`
        <style>
                .register-form {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                h2, h3 {
                    color: #333;
                }
                
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                h3 {
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
                
                .name-section {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f0f0f0;
                    border-radius: 6px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .form-row .form-group {
                    flex: 1;
                    margin-bottom: 0;
                }
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                
                .required {
                    color: #dc3545;
                }
                
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                    box-sizing: border-box;
                }
                
                .password-hint {
                    margin: 5px 0 0;
                    font-size: 12px;
                    color: #6c757d;
                }
                
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #159eff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                button:hover {
                    background-color: #0078cd;
                }
                
                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .error-message {
                    color: #dc3545;
                    margin: 10px 0;
                    padding: 10px;
                    background-color: #f8d7da;
                    border-radius: 4px;
                    font-size: 14px;
                }
                
                @media (max-width: 600px) {
                    .form-row {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
        </style>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element, styles);
    }
}

window.customElements.define("login-component", LoginComponent);

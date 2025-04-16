import { html } from "@web/helpers/webComponents";

export class RegisterComponent extends HTMLElement {
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
                <h2>Create Account</h2>
                <div id="error-message" class="error-message" style="display: none;"></div>
                <form id="register-form">
                    <div class="form-group">
                        <label for="username">Username: <span class="required">*</span></label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email: <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <!-- Name fields -->
                    <div class="name-section">
                        <h3>Full Name</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first-name">First Name: <span class="required">*</span></label>
                                <input type="text" id="first-name" name="first_name" required>
                            </div>
                            <div class="form-group">
                                <label for="prefix">Prefix:</label>
                                <input type="text" id="prefix" name="prefix" placeholder="e.g. Mr., Mrs., Dr.">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Last Name: <span class="required">*</span></label>
                            <input type="text" id="last-name" name="last_name" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password: <span class="required">*</span></label>
                        <input type="password" id="password" name="password" required>
                        <p class="password-hint">Password must be at least 8 characters long</p>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password: <span class="required">*</span></label>
                        <input type="password" id="confirm-password" name="confirm_password" required>
                    </div>
                    <div class="form-group">
                        <button type="submit" id="submit-button">Register</button>
                    </div>
                </form>
            </div>

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
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                button:hover {
                    background-color: #45a049;
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
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
    }
}

window.customElements.define("register-component", RegisterComponent);

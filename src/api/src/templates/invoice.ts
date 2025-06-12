function html(strings: TemplateStringsArray, ...values: unknown[]): string {
    let result: string = "";
    for (let i: number = 0; i < strings.length - 1; i++) {
        result += strings[i];
        result += String(values[i]);
    }
    result += strings[strings.length - 1];
    return result;
}

export default html`
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Betaling Bevestigd - Bedankt voor je bestelling</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 40px;
        }
        
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: #4CAF50;
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .success-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .customer-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .customer-info h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            font-weight: 600;
            color: #495057;
        }
        
        .info-value {
            color: #212529;
        }
        
        .order-summary {
            margin-bottom: 30px;
        }
        
        .order-summary h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .order-item.last-item {
            border-bottom: 2px solid #4CAF50;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .item-name {
            flex: 1;
        }
        
        .item-price {
            font-weight: 500;
        }
        
        .action-buttons {
            text-align: center;
            margin-top: 30px;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 10px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #4CAF50;
            color: white;
        }
        
        .btn-primary:hover {
            background: #45a049;
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
            transform: translateY(-2px);
        }
        
        .footer {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .status-badge {
            display: inline-block;
            background: #d4edda;
            color: #155724;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 20px;
                border-radius: 8px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .info-row {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header met bevestiging -->
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Betaling Succesvol!</h1>
            <p>Bedankt voor je bestelling bij LucaStars</p>
        </div>
        
        <!-- Hoofdinhoud -->
        <div class="content">
            <!-- Klantgegevens -->
            <div class="customer-info">
                <h2>Bestelling Details</h2>
                <div class="info-row">
                    <span class="info-label">Naam:</span>
                    <span class="info-value">{{ order.user.fullName }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Bestelnummer:</span>
                    <span class="info-value">#{{ order.id }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Datum:</span>
                    <span class="info-value">{{ order.orderDate }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge">Betaald</span>
                </div>
            </div>
            
            <!-- Bestelling overzicht -->
            <div class="order-summary">
                <h2>Jouw Aankoop</h2>
                {{#each order.games}}
                <div class="order-item">
                    <span class="item-name">{{ name }}</span>
                    <span class="item-price">{{ price }}</span>
                </div>
                {{/each}}
                <div class="order-item last-item">
                    <span class="item-name">Totaal Betaald</span>
                    <span class="item-price">{{ order.totalAmount }}</span>
                </div>
            </div>
            
            <!-- Actie knoppen -->
            <div class="action-buttons">
                <a href="{{ order.invoiceUrl }}" class="btn btn-primary">📄 Bekijk Factuur</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>Nogmaals bedankt voor je bestelling! We hopen dat je geniet van je aankoop.</p>
        </div>
    </div>
</body>
</html>
`;

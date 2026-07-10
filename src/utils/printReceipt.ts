export function printReceipt(order: any, restaurantName: string) {
  if (typeof window === "undefined") return;

  // Create an invisible iframe for isolated printing
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) return;

  const items = Array.isArray(order.items) ? order.items : [];
  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(2)}`;
  const dateStr = new Date(order.created_at).toLocaleString("de-DE");

  const itemsHtml = items
    .map(
      (it: any) => `
      <div class="item">
        <span>${it.qty ?? 1}x ${it.name}</span>
        <span>${it.price_cents ? formatPrice(it.price_cents * (it.qty ?? 1)) : ""}</span>
      </div>
    `,
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt #${order.id.slice(0, 8)}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background-color: #fff;
          }
          .receipt {
            padding: 10px 15px;
            box-sizing: border-box;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .restaurant-name {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
          .double-divider {
            border-top: 1px double #000;
            margin: 8px 0;
            height: 3px;
            border-bottom: 1px double #000;
          }
          .info-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
          }
          .totals {
            margin-top: 10px;
            font-weight: bold;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
          }
          .notes {
            margin-top: 10px;
            font-style: italic;
            font-size: 11px;
            background: #eee;
            padding: 5px;
            border-left: 2px solid #000;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="restaurant-name">${restaurantName}</div>
            <div>Speisely Marketplace</div>
            <div>*** KÜCHENZETTEL / RECEIPT ***</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-line">
            <span>BESTELLUNG:</span>
            <span>#${order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="info-line">
            <span>DATUM:</span>
            <span>${dateStr}</span>
          </div>
          <div class="info-line">
            <span>KUNDE:</span>
            <span>${order.customer_name ?? "Gast"}</span>
          </div>
          
          <div class="double-divider"></div>
          
          <div class="items-list">
            ${itemsHtml}
          </div>
          
          <div class="divider"></div>
          
          ${
            order.notes
              ? `<div class="notes">Hinweis: "${order.notes}"</div><div class="divider"></div>`
              : ""
          }
          
          <div class="totals">
            <span>GESAMT:</span>
            <span>${formatPrice(order.total_cents)}</span>
          </div>
          
          <div class="footer">
            Vielen Dank für Ihre Bestellung!<br>
            Powered by Speisely
          </div>
        </div>
      </body>
    </html>
  `;

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Trigger print after iframe loading is complete
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Clean up the iframe after print dialog is closed
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
}

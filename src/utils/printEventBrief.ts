export function printEventBrief(brief: any, brandName: string, type: "caterer" | "planner") {
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

  const dateStr = brief.event_date ? new Date(brief.event_date).toLocaleDateString("de-DE") : "TBD";
  const receivedStr = new Date(brief.created_at).toLocaleString("de-DE");
  const budgetStr = brief.budget_cents != null ? `€${(brief.budget_cents / 100).toFixed(2)}` : "—";
  const milestones = Array.isArray(brief.milestones) ? brief.milestones : [];

  const milestonesHtml =
    milestones.length > 0
      ? `
      <div class="section-title">Milestones / Projektverlauf</div>
      <table class="milestones-table">
        <thead>
          <tr>
            <th style="width: 30px;">[ ]</th>
            <th>Aktivität / Status</th>
            <th style="width: 120px; text-align: right;">Datum</th>
          </tr>
        </thead>
        <tbody>
          ${milestones
            .map(
              (m: any) => `
            <tr>
              <td><div class="checkbox"></div></td>
              <td><strong>${m.title || m.status || "Statusänderung"}</strong>${m.notes ? ` - <span class="notes-text">${m.notes}</span>` : ""}</td>
              <td style="text-align: right;">${new Date(m.created_at || m.timestamp).toLocaleDateString("de-DE")}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `
      : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Brief #${brief.id.slice(0, 8).toUpperCase()}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 20mm;
          }
          html, body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1.5;
            color: #111;
            background-color: #fff;
          }
          .container {
            width: 100%;
            box-sizing: border-box;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #16372f;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .header-brand {
            font-size: 20px;
            font-weight: 800;
            color: #16372f;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .header-meta {
            text-align: right;
            font-size: 11px;
            color: #666;
          }
          .title-section {
            margin-bottom: 25px;
          }
          .event-title {
            font-size: 24px;
            font-weight: 700;
            color: #111;
            margin: 0 0 5px 0;
          }
          .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .badge-b2b {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
            margin-right: 5px;
          }
          .badge-recurring {
            background-color: #f3e8ff;
            color: #6b21a8;
            border: 1px solid #e9d5ff;
          }
          .grid-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .grid-table td {
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            width: 50%;
            vertical-align: top;
          }
          .grid-table .label {
            font-size: 10px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          .grid-table .value {
            font-size: 14px;
            font-weight: 600;
            color: #111;
          }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #16372f;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .notes-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-left: 4px solid #16372f;
            padding: 12px 15px;
            font-style: italic;
            font-size: 13px;
            margin-bottom: 25px;
            white-space: pre-wrap;
          }
          .milestones-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .milestones-table th {
            font-size: 11px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            padding: 8px 10px;
            border-bottom: 2px solid #e5e7eb;
            text-align: left;
          }
          .milestones-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: middle;
          }
          .checkbox {
            width: 14px;
            height: 14px;
            border: 1px solid #666;
            border-radius: 3px;
          }
          .notes-text {
            font-size: 11px;
            color: #666;
          }
          .handwritten-section {
            border: 1px dashed #9ca3af;
            border-radius: 6px;
            padding: 15px;
            margin-top: 30px;
            min-height: 120px;
          }
          .handwritten-title {
            font-size: 11px;
            font-weight: 700;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .handwritten-section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="header-brand">${brandName}</div>
              <div style="font-size: 11px; color: #666;">
                Speisely Event-Partner · ${type === "caterer" ? "Catering" : "Eventplanung"}
              </div>
            </div>
            <div class="header-meta">
              <div>BRIEF-ID: <strong>#${brief.id.slice(0, 8).toUpperCase()}</strong></div>
              <div>Eingegangen: ${receivedStr}</div>
            </div>
          </div>

          <div class="title-section">
            <h1 class="event-title">${brief.company_name ? `${brief.company_name} — ` : ""}${brief.event_type ?? "Event-Buchung"}</h1>
            <div style="margin-top: 5px;">
              ${brief.is_b2b ? '<span class="badge badge-b2b">🏢 B2B Lead</span>' : ""}
              ${brief.is_recurring ? `<span class="badge badge-recurring">🔄 Intervall: ${brief.recurrence_pattern}</span>` : ""}
            </div>
          </div>

          <table class="grid-table">
            <tr>
              <td>
                <div class="label">Veranstaltungsdatum</div>
                <div class="value">${dateStr}</div>
              </td>
              <td>
                <div class="label">Gästeanzahl</div>
                <div class="value">${brief.guest_count ?? "—"} Personen</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="label">Veranstaltungsort</div>
                <div class="value">${brief.location ?? "TBD / Noch offen"}</div>
              </td>
              <td>
                <div class="label">Veranschlagtes Budget</div>
                <div class="value">${budgetStr}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="label">Ansprechpartner / Kontakt</div>
                <div class="value">${brief.contact_person ?? "Über Speisely Chat"}</div>
              </td>
              <td>
                <div class="label">Aktueller Status</div>
                <div class="value" style="text-transform: capitalize;">${brief.status.replace(/_/g, " ")}</div>
              </td>
            </tr>
          </table>

          ${
            brief.notes
              ? `
              <div class="section-title">Kundenhinweise / Anfrage-Details</div>
              <div class="notes-box">"${brief.notes}"</div>
            `
              : ""
          }

          ${milestonesHtml}

          <div class="handwritten-section">
            <div class="handwritten-title">Notizen für das Service-Team / Küche / Planung</div>
            <!-- Blank spacing for manual writing -->
          </div>

          <div class="footer">
            Dieser Event-Brief wurde über Speisely generiert. Stand: ${new Date().toLocaleDateString("de-DE")}.<br>
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

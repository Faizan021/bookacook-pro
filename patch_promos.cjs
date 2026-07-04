const fs = require('fs');
const path = require('path');

const newComponent = `function PromotionsSection({ vertical, availableItems = [] }: { vertical: "restaurants" | "caterers" | "planners"; availableItems?: string[] }) {
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const fetchPromos = useServerFn(getMyPromoCodes);
  const createPromo = useServerFn(createPromoCode);
  const togglePromo = useServerFn(togglePromoCode);
  const qc = useQueryClient();
  
  const q = useSuspenseQuery({
    queryKey: ["promotions"],
    queryFn: () => fetchPromos()
  });

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed" | "free_delivery" | "free_item" | "bogo">("percentage");
  const [value, setValue] = useState("");
  const [promote, setPromote] = useState(true);
  const [appliesTo, setAppliesTo] = useState<string>("all");
  const [minOrder, setMinOrder] = useState("");
  const [freeItemName, setFreeItemName] = useState<string>("");
  const [requiredQty, setRequiredQty] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    
    if (!code.trim()) return setErr(tt("Code fehlt", "Missing code"));
    if ((type === "percentage" || type === "fixed") && (!value || isNaN(Number(value)))) {
      return setErr(tt("Ungültiger Wert", "Invalid value"));
    }
    if (type === "free_item" && !freeItemName) {
      return setErr(tt("Bitte ein Gratis-Produkt auswählen", "Please select a free product"));
    }
    if (type === "bogo" && (!requiredQty || isNaN(Number(requiredQty)))) {
      return setErr(tt("Ungültige Menge für BOGO", "Invalid quantity for BOGO"));
    }

    setCreating(true);
    try {
      await createPromo({ 
        data: {
          code: code.trim(),
          discount_type: type,
          discount_value: (type === "percentage" || type === "fixed") ? Number(value) : 0,
          promote_on_storefront: promote,
          vertical,
          applies_to_product_name: appliesTo !== "all" ? appliesTo : undefined,
          min_order_value_cents: minOrder && !isNaN(Number(minOrder)) ? Math.round(Number(minOrder) * 100) : undefined,
          free_item_name: type === "free_item" ? freeItemName : undefined,
          required_qty: type === "bogo" ? Number(requiredQty) : undefined,
          starts_at: startsAt ? new Date(startsAt).toISOString() : undefined,
          ends_at: endsAt ? new Date(endsAt).toISOString() : undefined
        }
      });
      await qc.invalidateQueries({ queryKey: ["promotions"] });
      setCode("");
      setValue("");
      setAppliesTo("all");
      setMinOrder("");
      setFreeItemName("");
      setRequiredQty("");
      setStartsAt("");
      setEndsAt("");
      toast.success(tt("Promo-Code erstellt", "Promo code created"));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (promo: any) => {
    const now = new Date();
    if (!promo.is_active) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">{tt("Inaktiv", "Inactive")}</span>;
    }
    if (promo.starts_at && new Date(promo.starts_at) > now) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{tt("Geplant", "Scheduled")}</span>;
    }
    if (promo.ends_at && new Date(promo.ends_at) < now) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{tt("Abgelaufen", "Expired")}</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">{tt("Aktiv", "Active")}</span>;
  };

  const getPromoSummary = (promo: any) => {
    let text = "";
    if (promo.discount_type === "percentage") text = \`\${promo.discount_value}% OFF\`;
    else if (promo.discount_type === "fixed") text = \`€\${promo.discount_value} OFF\`;
    else if (promo.discount_type === "free_delivery") text = tt("Kostenlose Lieferung", "Free Delivery");
    else if (promo.discount_type === "free_item") text = tt(\`Gratis \${promo.free_item_name}\`, \`Free \${promo.free_item_name}\`);
    else if (promo.discount_type === "bogo") text = tt(\`Kaufe \${promo.required_qty} erhalte 1 gratis\`, \`Buy \${promo.required_qty} get 1 free\`);
    
    if (promo.applies_to_product_name) text += \` (\${promo.applies_to_product_name})\`;
    return text;
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-black mb-1">{tt("Promotions & Gutscheine", "Promotions & Vouchers")}</h2>
        <p className="text-gray-500 text-sm">{tt("Erstellen Sie Rabattcodes für Ihre Kunden.", "Create discount codes for your customers.")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-gray-100 bg-white shadow-sm rounded-2xl p-6 h-fit">
          <h3 className="font-semibold text-black mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-600" />
            {tt("Neuen Code erstellen", "Create New Code")}
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            {err && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{err}</div>}
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="z.B. SOMMER20" className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 uppercase text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Rabatt-Typ", "Discount Type")}</label>
              <select value={type} onChange={(e) => { setType(e.target.value as any); setValue(""); }} className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm">
                <option value="percentage">{tt("Prozentsatz", "Percentage")}</option>
                <option value="fixed">{tt("Fester Betrag", "Fixed Amount")}</option>
                <option value="free_delivery">{tt("Kostenlose Lieferung", "Free Delivery")}</option>
                <option value="free_item">{tt("Gratis-Artikel", "Free Item")}</option>
                <option value="bogo">{tt("Kauf X erhalte 1 gratis", "Buy X Get 1 Free")}</option>
              </select>
            </div>

            {(type === "percentage" || type === "fixed") && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Wert", "Value")} {type === "percentage" ? "(%)" : "(€)"}</label>
                <input type="number" step="any" value={value} onChange={e => setValue(e.target.value)} placeholder="z.B. 10" className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm" />
              </div>
            )}

            {type === "bogo" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Benötigte Menge (X)", "Required Quantity (X)")}</label>
                <input type="number" min="1" value={requiredQty} onChange={e => setRequiredQty(e.target.value)} placeholder="z.B. 2" className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm" />
              </div>
            )}

            {type === "free_item" && availableItems.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Gratis-Artikel", "Free Item")}</label>
                <select value={freeItemName} onChange={e => setFreeItemName(e.target.value)} className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm">
                  <option value="">{tt("Auswählen...", "Select...")}</option>
                  {availableItems.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}

            {(type !== "free_delivery" && type !== "free_item") && availableItems.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Gilt für", "Applies to")}</label>
                <select value={appliesTo} onChange={e => setAppliesTo(e.target.value)} className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm">
                  <option value="all">{tt("Gesamte Bestellung", "Entire Order")}</option>
                  {availableItems.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Mindestbestellwert (€) (Optional)", "Min. Order Value (€) (Optional)")}</label>
              <input type="number" min="0" step="any" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="z.B. 50" className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Gültig ab (Optional)", "Valid From (Optional)")}</label>
                <input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{tt("Gültig bis (Optional)", "Valid Until (Optional)")}</label>
                <input type="datetime-local" value={endsAt} onChange={e => setEndsAt(e.target.value)} className="w-full border-gray-200 rounded-xl focus:border-orange-500 focus:ring-orange-500 text-sm" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input type="checkbox" checked={promote} onChange={e => setPromote(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500 bg-white" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{tt("Im Shop ankündigen", "Announce on storefront")}</span>
                <span className="text-[10px] text-gray-500">{tt("Zeigt ein Banner für alle Besucher", "Shows a banner to all visitors")}</span>
              </div>
            </label>

            <button disabled={creating} type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
              {tt("Code Speichern", "Save Code")}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-black flex items-center gap-2 px-1">
            <Ticket className="w-4 h-4 text-orange-600" />
            {tt("Ihre Codes", "Your Codes")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.data?.map((p: any) => (
              <div key={p.id} className={\`bg-white border rounded-2xl p-5 transition-all shadow-sm \${p.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}\`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-black">{p.code}</span>
                      {getStatusBadge(p)}
                    </div>
                    <span className="text-orange-600 font-semibold text-sm">
                      {getPromoSummary(p)}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={p.is_active} onChange={async (e) => {
                      const active = e.target.checked;
                      await togglePromo({ data: { id: p.id, is_active: active } });
                      qc.invalidateQueries({ queryKey: ["promotions"] });
                      if(active) toast.success(tt("Aktiviert", "Activated"));
                      else toast.success(tt("Deaktiviert", "Deactivated"));
                    }} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>
                <div className="space-y-1 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  {p.min_order_value_cents > 0 && <p>• {tt("Mindestbestellwert:", "Min. Spend:")} €{(p.min_order_value_cents/100).toFixed(2)}</p>}
                  {p.starts_at && <p>• {tt("Start:", "Starts:")} {new Date(p.starts_at).toLocaleString()}</p>}
                  {p.ends_at && <p>• {tt("Ende:", "Ends:")} {new Date(p.ends_at).toLocaleString()}</p>}
                </div>
              </div>
            ))}
            {q.data?.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <Ticket className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p>{tt("Noch keine Codes erstellt", "No codes created yet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

const files = [
  'src/routes/_authenticated/restaurant.tsx',
  'src/routes/_authenticated/caterer.tsx',
  'src/routes/_authenticated/dashboard/planner.tsx'
];

for (const file of files) {
  const filePath = path.resolve(file);
  let code = fs.readFileSync(filePath, 'utf8');
  const startIdx = code.indexOf('function PromotionsSection(');
  if (startIdx === -1) {
    console.error('Could not find PromotionsSection in ' + file);
    continue;
  }
  let nextFunc = code.indexOf('function ', startIdx + 1);
  if (nextFunc === -1) nextFunc = code.length;
  
  code = code.slice(0, startIdx) + newComponent + '\n\n' + code.slice(nextFunc);
  fs.writeFileSync(filePath, code);
  console.log('Patched ' + file);
}

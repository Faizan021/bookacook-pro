const fs = require('fs');
let code = fs.readFileSync('src/routes/_authenticated/caterer.tsx', 'utf8');

code = code.replace(
  /function PromotionsSection\(\{ vertical \}: \{ vertical: "restaurants" \| "caterers" \| "planners" \}\) \{/,
  'import { getMyCatererMenu } from "@/lib/caterer/queries.functions";\n\nfunction PromotionsSection({ vertical }: { vertical: "restaurants" | "caterers" | "planners" }) {'
);

code = code.replace(
  'const qc = useQueryClient();',
  'const qc = useQueryClient();\n  const fetchMenu = useServerFn(getMyCatererMenu);\n  const menuQ = useQuery({\n    queryKey: ["caterer", "menu"],\n    queryFn: () => fetchMenu()\n  });\n  const availableItems = (menuQ.data || []).map((m: any) => m.name);'
);

code = code.replace(
  'const [value, setValue] = useState("");\n  const [promote, setPromote] = useState(true);',
  'const [value, setValue] = useState("");\n  const [appliesTo, setAppliesTo] = useState("");\n  const [promote, setPromote] = useState(true);'
);

code = code.replace(
  /promote_on_storefront: promote,\n\s+vertical\n\s+\}\}\);/,
  'promote_on_storefront: promote,\n        vertical,\n        applies_to_product_name: (appliesTo && appliesTo !== "all") ? appliesTo : undefined\n      }});'
);

code = code.replace(
  'setCode("");\n      setValue("");\n      qc.invalidateQueries',
  'setCode("");\n      setValue("");\n      setAppliesTo("");\n      qc.invalidateQueries'
);

const selectHtml = `          <div className="space-y-1.5 mt-3">
            <Label>{tt("Anwenden auf", "Applies to")}</Label>
            <Select value={appliesTo} onValueChange={setAppliesTo}>
              <SelectTrigger><SelectValue placeholder={tt("Gesamte Bestellung", "Entire Order")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tt("Gesamte Bestellung (Alle Produkte)", "Entire Order (All Products)")}</SelectItem>
                {availableItems.map(item => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2 pb-1`;

code = code.replace(
  '<div className="pt-2 pb-1',
  selectHtml
);

code = code.replace(
  /<h4 className="font-bold font-mono text-lg">\{c.code\}<\/h4>/,
  '<h4 className="font-bold font-mono text-lg">{c.code} {c.applies_to_product_name && <span className="text-sm font-normal text-muted-foreground ml-2">({c.applies_to_product_name})</span>}</h4>'
);

fs.writeFileSync('src/routes/_authenticated/caterer.tsx', code);
console.log('caterer.tsx patched');

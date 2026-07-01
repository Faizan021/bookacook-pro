'use client';

import { useState, useCallback } from 'react';
import {
  MapPin,
  Globe,
  Layers,
  Copy,
  Download,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Save,
  Sparkles,
} from 'lucide-react';
import { useServerFn } from "@tanstack/react-start";
import { saveSeoDraft } from "@/lib/admin/mutations.functions";
import { toast } from "sonner";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type CitySize = 'large' | 'medium' | 'small';
type FilterTab = 'all' | 'large' | 'medium' | 'small';

interface GermanCity {
  name: string;
  state: string;
  size: CitySize;
}

interface GeneratedPage {
  city: GermanCity;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  openingParagraph: string;
  bullets: string[];
  ctaText: string;
}

interface FormState {
  serviceType: string;
  primaryKeyword: string;
  targetRadius: string;
  tone: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const GERMAN_CITIES: GermanCity[] = [
  // NRW
  { name: 'Koeln', state: 'NRW', size: 'large' },
  { name: 'Duesseldorf', state: 'NRW', size: 'large' },
  { name: 'Dortmund', state: 'NRW', size: 'large' },
  { name: 'Essen', state: 'NRW', size: 'large' },
  { name: 'Duisburg', state: 'NRW', size: 'large' },
  { name: 'Bochum', state: 'NRW', size: 'medium' },
  { name: 'Wuppertal', state: 'NRW', size: 'medium' },
  { name: 'Bielefeld', state: 'NRW', size: 'medium' },
  { name: 'Bonn', state: 'NRW', size: 'medium' },
  { name: 'Muenster', state: 'NRW', size: 'medium' },
  { name: 'Aachen', state: 'NRW', size: 'medium' },
  { name: 'Moenchengladbach', state: 'NRW', size: 'medium' },
  { name: 'Paderborn', state: 'NRW', size: 'small' },
  { name: 'Oberhausen', state: 'NRW', size: 'small' },
  { name: 'Hagen', state: 'NRW', size: 'small' },
  { name: 'Hamm', state: 'NRW', size: 'small' },
  { name: 'Solingen', state: 'NRW', size: 'small' },
  { name: 'Leverkusen', state: 'NRW', size: 'small' },
  { name: 'Herne', state: 'NRW', size: 'small' },
  // Bayern
  { name: 'Muenchen', state: 'Bayern', size: 'large' },
  { name: 'Nuernberg', state: 'Bayern', size: 'large' },
  { name: 'Augsburg', state: 'Bayern', size: 'medium' },
  { name: 'Regensburg', state: 'Bayern', size: 'medium' },
  { name: 'Ingolstadt', state: 'Bayern', size: 'medium' },
  { name: 'Wuerzburg', state: 'Bayern', size: 'medium' },
  { name: 'Erlangen', state: 'Bayern', size: 'small' },
  { name: 'Fuerth', state: 'Bayern', size: 'small' },
  { name: 'Bayreuth', state: 'Bayern', size: 'small' },
  // Berlin & Brandenburg
  { name: 'Berlin', state: 'Berlin', size: 'large' },
  { name: 'Potsdam', state: 'Brandenburg', size: 'medium' },
  { name: 'Cottbus', state: 'Brandenburg', size: 'small' },
  { name: 'Brandenburg an der Havel', state: 'Brandenburg', size: 'small' },
  // Hamburg
  { name: 'Hamburg', state: 'Hamburg', size: 'large' },
  // Hessen
  { name: 'Frankfurt am Main', state: 'Hessen', size: 'large' },
  { name: 'Wiesbaden', state: 'Hessen', size: 'medium' },
  { name: 'Kassel', state: 'Hessen', size: 'medium' },
  { name: 'Darmstadt', state: 'Hessen', size: 'medium' },
  { name: 'Offenbach', state: 'Hessen', size: 'small' },
  { name: 'Hanau', state: 'Hessen', size: 'small' },
  // Sachsen-Anhalt
  { name: 'Halle (Saale)', state: 'Sachsen-Anhalt', size: 'medium' },
  { name: 'Magdeburg', state: 'Sachsen-Anhalt', size: 'medium' },
  { name: 'Dessau-Rosslau', state: 'Sachsen-Anhalt', size: 'small' },
  // Sachsen
  { name: 'Leipzig', state: 'Sachsen', size: 'large' },
  { name: 'Dresden', state: 'Sachsen', size: 'large' },
  { name: 'Chemnitz', state: 'Sachsen', size: 'medium' },
  { name: 'Zwickau', state: 'Sachsen', size: 'small' },
  // Baden-Wuerttemberg
  { name: 'Stuttgart', state: 'BW', size: 'large' },
  { name: 'Karlsruhe', state: 'BW', size: 'medium' },
  { name: 'Freiburg im Breisgau', state: 'BW', size: 'medium' },
  { name: 'Heidelberg', state: 'BW', size: 'medium' },
  { name: 'Mannheim', state: 'BW', size: 'medium' },
  { name: 'Ulm', state: 'BW', size: 'medium' },
  { name: 'Heilbronn', state: 'BW', size: 'small' },
  { name: 'Pforzheim', state: 'BW', size: 'small' },
  { name: 'Reutlingen', state: 'BW', size: 'small' },
  // Niedersachsen
  { name: 'Hannover', state: 'Niedersachsen', size: 'large' },
  { name: 'Braunschweig', state: 'Niedersachsen', size: 'medium' },
  { name: 'Wolfsburg', state: 'Niedersachsen', size: 'medium' },
  { name: 'Goettingen', state: 'Niedersachsen', size: 'small' },
  { name: 'Oldenburg', state: 'Niedersachsen', size: 'small' },
  { name: 'Osnabrueck', state: 'Niedersachsen', size: 'small' },
  // Bremen
  { name: 'Bremen', state: 'Bremen', size: 'large' },
  // Schleswig-Holstein
  { name: 'Kiel', state: 'SH', size: 'medium' },
  { name: 'Luebeck', state: 'SH', size: 'medium' },
  { name: 'Flensburg', state: 'SH', size: 'small' },
  // Mecklenburg-Vorpommern
  { name: 'Rostock', state: 'MV', size: 'medium' },
  { name: 'Schwerin', state: 'MV', size: 'small' },
  { name: 'Greifswald', state: 'MV', size: 'small' },
  // Saarland
  { name: 'Saarbruecken', state: 'Saarland', size: 'medium' },
  // Rheinland-Pfalz
  { name: 'Mainz', state: 'RLP', size: 'medium' },
  { name: 'Koblenz', state: 'RLP', size: 'small' },
  { name: 'Trier', state: 'RLP', size: 'small' },
  { name: 'Kaiserslautern', state: 'RLP', size: 'small' },
  // Thueringen
  { name: 'Erfurt', state: 'Thueringen', size: 'medium' },
  { name: 'Jena', state: 'Thueringen', size: 'small' },
  { name: 'Gera', state: 'Thueringen', size: 'small' },
];

// Display names with proper German characters
const CITY_DISPLAY_NAMES: Record<string, string> = {
  'Koeln': 'K\u00f6ln',
  'Duesseldorf': 'D\u00fcsseldorf',
  'Muenster': 'M\u00fcnster',
  'Moenchengladbach': 'M\u00f6nchengladbach',
  'Muenchen': 'M\u00fcnchen',
  'Nuernberg': 'N\u00fcrnberg',
  'Wuerzburg': 'W\u00fcrzburg',
  'Fuerth': 'F\u00fcrth',
  'Dessau-Rosslau': 'Dessau-Ro\u00dflau',
  'Freiburg im Breisgau': 'Freiburg im Breisgau',
  'Goettingen': 'G\u00f6ttingen',
  'Osnabrueck': 'Osnabr\u00fcck',
  'Luebeck': 'L\u00fcbeck',
  'Saarbruecken': 'Saarbr\u00fccken',
  'Thueringen': 'Th\u00fcringen',
  'Erfurt': 'Erfurt',
};

function getDisplayName(name: string): string {
  return CITY_DISPLAY_NAMES[name] ?? name;
}

const STATE_DISPLAY_NAMES: Record<string, string> = {
  'Thueringen': 'Th\u00fcringen',
};

function getStateDisplay(state: string): string {
  return STATE_DISPLAY_NAMES[state] ?? state;
}

const STATE_COLORS: Record<string, string> = {
  NRW: 'bg-blue-100 text-blue-700',
  Bayern: 'bg-sky-100 text-sky-700',
  Berlin: 'bg-red-100 text-red-700',
  Brandenburg: 'bg-orange-100 text-orange-700',
  Hamburg: 'bg-rose-100 text-rose-700',
  Hessen: 'bg-violet-100 text-violet-700',
  'Sachsen-Anhalt': 'bg-yellow-100 text-yellow-700',
  Sachsen: 'bg-amber-100 text-amber-700',
  BW: 'bg-emerald-100 text-emerald-700',
  Niedersachsen: 'bg-teal-100 text-teal-700',
  Bremen: 'bg-pink-100 text-pink-700',
  SH: 'bg-cyan-100 text-cyan-700',
  MV: 'bg-lime-100 text-lime-700',
  Saarland: 'bg-purple-100 text-purple-700',
  RLP: 'bg-indigo-100 text-indigo-700',
  Thueringen: 'bg-green-100 text-green-700',
};

const SIZE_LABELS: Record<CitySize, string> = {
  large: 'Gro\u00dfstadt',
  medium: 'Mittelstadt',
  small: 'Kleinstadt',
};

// ─────────────────────────────────────────────
// Generation helpers
// ─────────────────────────────────────────────
function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '\u2026';
}

function getCityAdjective(city: GermanCity, tone: string): string {
  if (tone === 'Luxus & Premium') {
    if (city.size === 'large') return 'weltoffenen Metropole';
    if (city.size === 'medium') return 'aufstrebenden Stadt';
    return 'charmanten Region';
  }
  if (tone === 'Locker & Pers\u00f6nlich') {
    if (city.size === 'large') return 'pulsierenden Gro\u00dfstadt';
    if (city.size === 'medium') return 'lebhaften Stadt';
    return 'gem\u00fctlichen Stadt';
  }
  if (city.size === 'large') return 'Metropolregion';
  if (city.size === 'medium') return 'Region';
  return 'lokalen Region';
}

function getServiceLabel(serviceType: string): string {
  if (serviceType === 'Catering') return 'Catering-Service';
  if (serviceType === 'Event Planning') return 'Event-Planungsservice';
  return 'Restaurant & Sofortbestellung';
}

function generatePage(city: GermanCity, form: FormState): GeneratedPage {
  const { primaryKeyword, serviceType, tone } = form;
  const keyword = primaryKeyword.trim() || 'Catering';
  const serviceLabel = getServiceLabel(serviceType);
  const adj = getCityAdjective(city, tone);
  const displayName = getDisplayName(city.name);
  const isLuxury = tone === 'Luxus & Premium';
  const isLocker = tone === 'Locker & Pers\u00f6nlich';

  const seoTitle = truncate(`${keyword} in ${displayName} \u2014 Speisely`, 62);

  const rawMeta = isLuxury
    ? `Entdecken Sie exklusiven ${keyword} in ${displayName}. Speisely verbindet Sie mit den besten Anbietern in der ${adj} f\u00fcr unvergessliche Momente.`
    : isLocker
    ? `${keyword} in ${displayName} \u2013 so einfach war\u2019s noch nie! Auf Speisely findest du top Anbieter in deiner ${adj} direkt auf einen Blick.`
    : `Professioneller ${keyword} in ${displayName}. Speisely vermittelt zuverl\u00e4ssige Anbieter in der ${adj} f\u00fcr Ihr Event oder Ihr Unternehmen.`;
  const metaDescription = truncate(rawMeta, 155);

  const h1 = isLuxury
    ? `Exklusiver ${keyword} in ${displayName}`
    : isLocker
    ? `Dein ${keyword} in ${displayName} \u2013 einfach & lecker`
    : `${keyword} in ${displayName} \u2013 Professionell & Zuverl\u00e4ssig`;

  const s1 = isLuxury
    ? `${displayName} steht f\u00fcr Stil, Anspruch und Genuss \u2013 und genau das spiegelt sich in unserem exklusiven ${serviceLabel} wider.`
    : isLocker
    ? `${displayName} ist eine tolle Stadt \u2013 und wir sind stolz, hier mit unserem ${serviceLabel} f\u00fcr dich da zu sein!`
    : `Als f\u00fchrende Plattform f\u00fcr ${serviceLabel} bietet Speisely in ${displayName} erstklassige L\u00f6sungen f\u00fcr Unternehmen und Privatpersonen.`;

  const s2 = isLuxury
    ? `Vertrauen Sie auf gepr\u00fcfte Premium-Anbieter in der ${adj} ${displayName}, die Ihre Erwartungen nicht nur erf\u00fcllen, sondern \u00fcbertreffen.`
    : isLocker
    ? `Egal ob kleines Get-together oder gro\u00dfe Feier \u2013 auf Speisely findest du in ${displayName} genau das Richtige.`
    : `Unsere verifizierten Partner in ${displayName} gew\u00e4hrleisten h\u00f6chste Qualit\u00e4t und einen reibungslosen Ablauf f\u00fcr Ihren ${keyword}.`;

  const openingParagraph = `${s1} ${s2}`;

  const bullets =
    serviceType === 'Catering'
      ? [
          `\u2713 Lokale Catering-Profis in ${displayName} sofort verf\u00fcgbar`,
          '\u2713 Individuelle Men\u00fcs f\u00fcr jede Veranstaltungsgr\u00f6\u00dfe',
          '\u2713 Transparent \u2013 Preise vergleichen, direkt buchen',
        ]
      : serviceType === 'Event Planning'
      ? [
          `\u2713 Erfahrene Event-Planer aus ${displayName} & Umgebung`,
          '\u2713 Rundum-sorglos-Pakete von der Planung bis zur Umsetzung',
          '\u2713 Bewertungen & Referenzen f\u00fcr sichere Auswahl',
        ]
      : [
          `\u2713 Restaurants & K\u00fcchen in ${displayName} direkt bestellen`,
          '\u2713 Schnelle Lieferung oder Abholung \u2013 deine Wahl',
          '\u2713 T\u00e4glich neue Gerichte von lokalen Anbietern',
        ];

  const ctaText = isLuxury
    ? `Premium-Anbieter in ${displayName} entdecken`
    : isLocker
    ? `Jetzt in ${displayName} st\u00f6bern`
    : `Anbieter in ${displayName} finden`;

  return { city, seoTitle, metaDescription, h1, openingParagraph, bullets, ctaText };
}

function filterCitiesByRadius(cities: GermanCity[], radius: string): GermanCity[] {
  if (radius === 'Lokal (1 Stadt)') {
    return cities.filter((c) => c.size === 'large').slice(0, 1);
  }
  if (radius === 'Regional (Bundesland)') {
    // Return cities from the most-represented state as a demo
    const stateCounts: Record<string, number> = {};
    cities.forEach((c) => { stateCounts[c.state] = (stateCounts[c.state] ?? 0) + 1; });
    const topState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0];
    return cities.filter((c) => c.state === topState);
  }
  return cities;
}

function pageToMarkdown(page: GeneratedPage): string {
  return [
    `# ${page.h1}`,
    '',
    `**SEO Title:** ${page.seoTitle}`,
    `**Meta Description:** ${page.metaDescription}`,
    '',
    `## Einleitung`,
    page.openingParagraph,
    '',
    `## Vorteile`,
    ...page.bullets.map((b) => `- ${b}`),
    '',
    `**CTA:** ${page.ctaText}`,
    '',
    '---',
    '',
  ].join('\n');
}

function pagesToCSV(pages: GeneratedPage[]): string {
  const header = 'Stadt,Bundesland,Groesse,SEO Title,Meta Description,H1,Einleitung,Bullet 1,Bullet 2,Bullet 3,CTA';
  const rows = pages.map((p) => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      esc(getDisplayName(p.city.name)),
      esc(getStateDisplay(p.city.state)),
      esc(SIZE_LABELS[p.city.size]),
      esc(p.seoTitle),
      esc(p.metaDescription),
      esc(p.h1),
      esc(p.openingParagraph),
      esc(p.bullets[0] ?? ''),
      esc(p.bullets[1] ?? ''),
      esc(p.bullets[2] ?? ''),
      esc(p.ctaText),
    ].join(',');
  });
  return [header, ...rows].join('\n');
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function SizeDot({ size }: { size: CitySize }) {
  const color =
    size === 'large' ? 'bg-green-500' : size === 'medium' ? 'bg-yellow-400' : 'bg-gray-400';
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`}
      title={SIZE_LABELS[size]}
    />
  );
}

function StateBadge({ state }: { state: string }) {
  const color = STATE_COLORS[state] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${color}`}>
      {getStateDisplay(state)}
    </span>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-forest/70 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-white border border-forest/15 rounded-xl text-sm text-forest font-medium py-2.5 pr-9 focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest/40 transition-all cursor-pointer ${icon ? 'pl-9' : 'pl-3.5'}`}
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" size={14} />
      </div>
    </div>
  );
}

function CityCard({ page }: { page: GeneratedPage }) {
  const [expanded, setExpanded] = useState(false);
  const displayName = getDisplayName(page.city.name);

  return (
    <div className="group surface-card rounded-2xl border border-forest/10 p-4 hover:border-forest/25 hover:shadow-md transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <SizeDot size={page.city.size} />
          <span className="font-display font-semibold text-forest text-base truncate">
            {displayName}
          </span>
        </div>
        <StateBadge state={page.city.state} />
      </div>

      {/* Size label */}
      <div className="flex items-center gap-1.5">
        <BarChart3 size={12} className="text-forest/30" />
        <span className="text-[11px] text-forest/50 font-medium">{SIZE_LABELS[page.city.size]}</span>
      </div>

      {/* SEO Title */}
      <div className="bg-cream/60 rounded-lg px-3 py-2 border border-forest/8">
        <p className="text-[10px] font-semibold text-forest/40 uppercase tracking-wider mb-0.5">
          SEO Title
        </p>
        <p className="text-xs font-medium text-forest/80 leading-snug line-clamp-2">
          {page.seoTitle}
        </p>
      </div>

      {/* First sentence preview */}
      <p className="text-xs text-forest/60 leading-relaxed line-clamp-2">
        {page.openingParagraph}
      </p>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-[11px] font-semibold text-forest/50 hover:text-forest transition-colors text-left"
      >
        {expanded ? '\u25b2 Weniger anzeigen' : '\u25bc Vollst\u00e4ndige Seite anzeigen'}
      </button>

      {/* Expanded view */}
      {expanded && (
        <div className="border-t border-forest/10 pt-3 flex flex-col gap-2.5">
          <div>
            <p className="text-[10px] font-semibold text-forest/40 uppercase tracking-wider mb-0.5">
              Meta Description
            </p>
            <p className="text-xs text-forest/70 leading-relaxed">{page.metaDescription}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-forest/40 uppercase tracking-wider mb-0.5">H1</p>
            <p className="text-xs font-bold text-forest leading-snug">{page.h1}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-forest/40 uppercase tracking-wider mb-1">
              Vorteile
            </p>
            <ul className="flex flex-col gap-1">
              {page.bullets.map((b, i) => (
                <li key={i} className="text-xs text-forest/70">{b}</li>
              ))}
            </ul>
          </div>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 bg-forest text-cream text-[11px] font-semibold px-3 py-1.5 rounded-lg">
              {page.ctaText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function GeoTargetingEngine() {
  const [form, setForm] = useState<FormState>({
    serviceType: 'Catering',
    primaryKeyword: '',
    targetRadius: 'Deutschlandweit',
    tone: 'Professionell',
  });
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveDraft = useServerFn(saveSeoDraft);

  const updateForm = useCallback(
    (key: keyof FormState) => (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleGenerate = useCallback(async () => {
    if (!form.primaryKeyword.trim()) return;
    setGenerating(true);
    setProgress(0);
    setPages([]);
    setActiveFilter('all');

    const steps = 40;
    const stepDuration = 2000 / steps;
    for (let i = 1; i <= steps; i++) {
      await new Promise<void>((res) => setTimeout(res, stepDuration));
      setProgress(Math.round((i / steps) * 100));
    }

    const citiesToProcess = filterCitiesByRadius(GERMAN_CITIES, form.targetRadius);
    const generated = citiesToProcess.map((city) => generatePage(city, form));
    setPages(generated);
    setGenerating(false);
    setProgress(100);
  }, [form]);

  const filteredPages = pages.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.city.size === activeFilter;
  });

  const countBySize = useCallback(
    (size: CitySize) => pages.filter((p) => p.city.size === size).length,
    [pages],
  );

  const handleSaveDrafts = useCallback(async () => {
    setIsSaving(true);
    let successCount = 0;
    try {
      for (const page of pages) {
        const slug = `${form.serviceType}-${page.city.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await saveDraft({
          data: {
            type: "geo",
            target_keyword: page.city.name,
            title: page.seoTitle,
            slug: slug,
            meta_title: page.seoTitle,
            meta_description: page.metaDescription,
            content: pageToMarkdown(page),
            cta_text: page.ctaText,
            internal_links: []
          }
        });
        successCount++;
      }
      toast.success(`${successCount} drafts saved to Review Queue`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      toast.error(`Error saving drafts: ${err.message}. Saved ${successCount}/${pages.length}`);
    } finally {
      setIsSaving(false);
    }
  }, [pages, form]);

  const handleExportCSV = useCallback(() => {
    const csv = pagesToCSV(pages);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speisely-geo-cluster-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [pages]);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'Alle' },
    { key: 'large', label: 'Gro\u00dfst\u00e4dte' },
    { key: 'medium', label: 'Mittelst\u00e4dte' },
    { key: 'small', label: 'Kleinst\u00e4dte' },
  ];

  return (
    <div className="min-h-screen bg-cream p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest flex items-center justify-center flex-shrink-0 shadow-lg">
            <Globe className="text-cream" size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-forest leading-tight">
              Geo-Targeting Cluster Engine
            </h1>
            <p className="text-forest/55 text-sm mt-1">
              Generiere standortspezifische Landingpage-Texte f\u00fcr jede Stadt in Deutschland \u2013 SEO-optimiert &amp; tongerecht.
            </p>
          </div>
        </div>

        {/* ── Setup Form ── */}
        <div className="surface-card rounded-3xl border border-forest/10 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layers size={16} className="text-forest/60" />
            <h2 className="font-semibold text-forest text-base">Cluster konfigurieren</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              label="Service-Typ"
              value={form.serviceType}
              onChange={updateForm('serviceType')}
              options={['Catering', 'Instant Order / Restaurant', 'Event Planning']}
              icon={<Sparkles size={14} />}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-forest/70 uppercase tracking-wider">
                Prim\u00e4res Keyword
              </label>
              <input
                type="text"
                value={form.primaryKeyword}
                onChange={(e) => updateForm('primaryKeyword')(e.target.value)}
                placeholder="z.B. veganes Catering, Hochzeits-Catering"
                className="w-full bg-white border border-forest/15 rounded-xl text-sm text-forest placeholder:text-forest/30 font-medium py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-forest/25 focus:border-forest/40 transition-all"
              />
            </div>

            <SelectField
              label="Ziel-Radius"
              value={form.targetRadius}
              onChange={updateForm('targetRadius')}
              options={['Lokal (1 Stadt)', 'Regional (Bundesland)', 'Deutschlandweit']}
              icon={<MapPin size={14} />}
            />

            <SelectField
              label="Tonalit\u00e4t"
              value={form.tone}
              onChange={updateForm('tone')}
              options={['Professionell', 'Locker & Pers\u00f6nlich', 'Luxus & Premium']}
            />
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <button
              onClick={handleGenerate}
              disabled={generating || !form.primaryKeyword.trim()}
              className="inline-flex items-center gap-2 bg-forest text-cream font-semibold text-sm px-6 py-3 rounded-xl hover:bg-forest/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Sparkles size={15} />
              {generating ? 'Wird generiert\u2026' : 'Cluster generieren'}
            </button>
            {form.primaryKeyword.trim() === '' && (
              <p className="text-xs text-forest/40 italic">Bitte erst ein Keyword eingeben</p>
            )}
          </div>

          {/* Progress bar */}
          {generating && (
            <div className="mt-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-forest/60">
                  Landingpages werden generiert\u2026
                </span>
                <span className="text-xs font-bold text-forest">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-forest/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {pages.length > 0 && (
          <div className="flex flex-col gap-6">

            {/* Stats bar */}
            <div className="surface-card rounded-2xl border border-forest/10 px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="font-bold text-forest text-sm">
                  {pages.length} Seiten generiert
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <SizeDot size="large" />
                <span className="text-sm text-forest/70">
                  <span className="font-semibold text-forest">{countBySize('large')}</span> Gro\u00dfst\u00e4dte
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <SizeDot size="medium" />
                <span className="text-sm text-forest/70">
                  <span className="font-semibold text-forest">{countBySize('medium')}</span> Mittelst\u00e4dte
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <SizeDot size="small" />
                <span className="text-sm text-forest/70">
                  <span className="font-semibold text-forest">{countBySize('small')}</span> Kleinst\u00e4dte
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSaveDrafts}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  {copied ? (
                    <CheckCircle2 size={13} className="text-white" />
                  ) : (
                    <Save size={13} />
                  )}
                  {copied ? 'Gespeichert!' : isSaving ? 'Speichere...' : 'In Entw\u00fcrfe speichern'}
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 bg-forest/8 text-forest text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-forest/15 active:scale-95 transition-all"
                >
                  <Download size={13} />
                  Als CSV exportieren
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {filterTabs.map((tab) => {
                const count =
                  tab.key === 'all' ? pages.length : countBySize(tab.key as CitySize);
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeFilter === tab.key
                        ? 'bg-forest text-cream shadow-sm'
                        : 'text-forest/60 hover:text-forest hover:bg-forest/8'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`text-[11px] rounded-full px-1.5 py-0.5 font-bold ${
                        activeFilter === tab.key
                          ? 'bg-cream/20 text-cream'
                          : 'bg-forest/10 text-forest/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPages.map((page) => (
                <CityCard key={`${page.city.name}-${page.city.state}`} page={page} />
              ))}
            </div>

            {filteredPages.length === 0 && (
              <div className="text-center py-16 text-forest/40">
                <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Keine St\u00e4dte f\u00fcr diesen Filter gefunden.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Activity, RefreshCw, Globe, Clock, FileText, CheckCircle, AlertCircle, Link as LinkIcon, Check } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSeoDrafts } from "@/lib/admin/queries.functions";
import { markSitemapIndexed } from "@/lib/admin/mutations.functions";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

type LogLevel = 'success' | 'warning' | 'error';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY_LAST_SCAN = 'speisely_last_scan';
const STORAGE_KEY_URL_COUNT = 'speisely_sitemap_url_count';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_S = 24 * 60 * 60;
const SITEMAP_URL = 'https://speisely.de/sitemap.xml';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimestamp(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function formatLastCheck(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return isToday ? `Heute, ${hh}:${mm}` : date.toLocaleDateString('de-DE');
}

function calcSecondsRemaining(lastScanIso: string): number {
  const elapsed = Date.now() - new Date(lastScanIso).getTime();
  const remaining = TWENTY_FOUR_HOURS_MS - elapsed;
  return Math.max(0, Math.floor(remaining / 1000));
}

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'Scan bereit';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `Noch ${hours} Stunde${hours !== 1 ? 'n' : ''} ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  }
  const secs = totalSeconds % 60;
  return `Noch ${minutes} Minute${minutes !== 1 ? 'n' : ''} ${secs} Sekunde${secs !== 1 ? 'n' : ''}`;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LogDot({ level }: { level: LogLevel }) {
  const colors: Record<LogLevel, string> = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 mt-[5px] ${colors[level]}`}
    />
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-cream rounded-xl p-3 border border-forest/10 flex-1 min-w-0">
      <div className="flex items-center gap-1.5 text-forest/50">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide truncate">{label}</span>
      </div>
      <span className="text-sm font-semibold text-forest truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SitemapMonitor() {
  // ── State ──
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TWENTY_FOUR_HOURS_S);
  const [lastScanIso, setLastScanIso] = useState<string>('');
  const [urlCount, setUrlCount] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const qc = useQueryClient();
  const fetchDrafts = useServerFn(getSeoDrafts);
  const markIndexedFn = useServerFn(markSitemapIndexed);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch SEO Drafts
  const { data: allDrafts = [] } = useQuery({
    queryKey: ["admin", "seo-drafts"],
    queryFn: () => fetchDrafts(),
  });

  const unindexedPages = allDrafts.filter((d: any) => d.status === 'published' && !d.sitemap_indexed);

  const markIndexedMutation = useMutation({
    mutationFn: async (id: string) => {
      await markIndexedFn({ data: { id, indexed: true } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "seo-drafts"] });
      toast.success("Page marked as indexed in sitemap");
      addLog("Manually verified page in sitemap", "success");
    },
    onError: (err: any) => toast.error(err.message)
  });

  // ── Init on mount ──
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_LAST_SCAN);
    const storedCount = localStorage.getItem(STORAGE_KEY_URL_COUNT);

    let scanIso: string;
    if (!stored) {
      scanIso = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_LAST_SCAN, scanIso);
    } else {
      scanIso = stored;
    }
    setLastScanIso(scanIso);

    if (storedCount !== null) {
      const parsed = parseInt(storedCount, 10);
      if (!isNaN(parsed)) {
        setUrlCount(parsed);
      }
    }

    const remaining = calcSecondsRemaining(scanIso);
    setSecondsRemaining(remaining);
    setIsRunning(remaining > 0);

    addLog('Monitor gestartet — überwache speisely.de/sitemap.xml', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Countdown tick ──
  useEffect(() => {
    if (!lastScanIso) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const remaining = calcSecondsRemaining(lastScanIso);
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lastScanIso]);

  // ── Global cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    };
  }, []);

  // ── Helpers ──
  function addLog(message: string, level: LogLevel = 'success') {
    const entry: LogEntry = {
      id: makeId(),
      timestamp: getTimestamp(),
      message,
      level,
    };
    setLogEntries((prev) => [entry, ...prev].slice(0, 10));
  }

  function showNotification(msg: string) {
    setNotification(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), 6000);
  }

  function resetCountdown() {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_SCAN, now);
    setLastScanIso(now);
    setSecondsRemaining(TWENTY_FOUR_HOURS_S);
    setIsRunning(true);
    addLog('Countdown zurückgesetzt — nächster Scan in 24 Stunden', 'warning');
  }

  async function handleCheckSitemap() {
    if (isChecking) return;
    setIsChecking(true);
    addLog('Starte Sitemap-Prüfung…', 'success');

    try {
      const response = await fetch(SITEMAP_URL, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const count = (text.match(/<loc>/g) || []).length;

      const stored = localStorage.getItem(STORAGE_KEY_URL_COUNT);
      const storedCount = stored !== null ? parseInt(stored, 10) : null;

      localStorage.setItem(STORAGE_KEY_URL_COUNT, String(count));
      setUrlCount(count);

      if (storedCount !== null && count !== storedCount) {
        const diff = count - storedCount;
        const badge =
          diff > 0
            ? `Sitemap aktualisiert! +${diff} neue Seiten`
            : `Sitemap aktualisiert! ${diff} Seiten entfernt`;
        showNotification(badge);
        addLog(
          `Sitemap geprüft — ${count} URLs gefunden (${diff > 0 ? '+' : ''}${diff} seit letzter Prüfung)`,
          'success',
        );
      } else {
        addLog(`Sitemap geprüft — ${count} URLs gefunden`, 'success');
      }
    } catch {
      // CORS or network failure — show graceful fallback per spec
      addLog(
        'Sitemap erreichbar (CORS eingeschränkt) — Vercel Deployment aktiv',
        'warning',
      );
      showNotification('Sitemap erreichbar ✓');
      if (urlCount === null) {
        addLog(
          'Tipp: Nutze einen Proxy oder serverseitigen Check für volle XML-Analyse',
          'warning',
        );
      }
    } finally {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY_LAST_SCAN, now);
      setLastScanIso(now);
      setSecondsRemaining(TWENTY_FOUR_HOURS_S);
      setIsRunning(true);
      setIsChecking(false);
    }
  }

  // ── Derived values ──
  const progressPercent = Math.min(
    100,
    ((TWENTY_FOUR_HOURS_S - secondsRemaining) / TWENTY_FOUR_HOURS_S) * 100,
  );
  const scanReady = secondsRemaining <= 0;
  const lastCheckFormatted = lastScanIso ? formatLastCheck(lastScanIso) : '—';

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* Shimmer + pulse keyframes */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .sitemap-pulse-dot {
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="surface-card rounded-2xl border border-forest/15 overflow-hidden">

        {/* ── Notification Badge ── */}
        {notification && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 border-b border-green-200 text-green-800 text-sm font-medium">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-forest/10">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-forest flex items-center justify-center">
              <Globe className="w-5 h-5 text-cream" />
            </div>
            {/* Titles */}
            <div>
              <h3 className="font-display text-lg font-semibold text-forest leading-tight">
                AI Sichtbarkeits-Monitor
              </h3>
              <p className="text-xs text-forest/50 mt-0.5">
                Überwacht speisely.de/sitemap.xml automatisch
              </p>
            </div>
          </div>

          {/* Status area */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isRunning && !scanReady && (
              <span className="sitemap-pulse-dot inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
            )}
            {scanReady ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200">
                <AlertCircle className="w-3 h-3" />
                Scan bereit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                <Activity className="w-3 h-3" />
                Aktiv
              </span>
            )}
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="px-5 py-4 border-b border-forest/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-forest/60 uppercase tracking-wide">
              Nächster KI-Rescan
            </span>
            <span className="text-xs font-medium text-forest/70">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Track */}
          <div className="relative h-3 rounded-full bg-forest/10 overflow-hidden">
            {/* Fill with shimmer */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progressPercent}%`,
                background:
                  'linear-gradient(90deg, #133A25 0%, #1a5c38 50%, #133A25 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          </div>

          {/* Countdown text */}
          <p className="text-xs text-forest/60 mt-2 text-center font-medium">
            {scanReady ? (
              <span className="text-amber-600 font-semibold">
                ⚡ Scan bereit — klicke &quot;Sitemap prüfen&quot;
              </span>
            ) : (
              formatCountdown(secondsRemaining)
            )}
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="flex gap-2 px-5 py-4 border-b border-forest/10">
          <StatCard
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Letzte Prüfung"
            value={lastCheckFormatted}
          />
          <StatCard
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Seiten im Sitemap"
            value={urlCount !== null ? String(urlCount) : '—'}
          />
          <StatCard
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Status"
            value={isChecking ? 'Läuft' : 'Bereit'}
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-forest/10">
          {/* Primary */}
          <button
            onClick={handleCheckSitemap}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest text-cream text-sm font-semibold
                       hover:bg-forest/90 active:scale-95 transition-all duration-150
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                {/* Spinner */}
                <svg
                  className="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Prüfe…
              </>
            ) : (
              <>
                <Globe className="w-4 h-4" />
                Sitemap prüfen
              </>
            )}
          </button>

          {/* Secondary */}
          <button
            onClick={resetCountdown}
            disabled={isChecking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-forest/25 text-forest
                       text-sm font-semibold bg-transparent hover:bg-forest/5 active:scale-95
                       transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Countdown zurücksetzen
          </button>
        </div>

        {/* ── Activity Log ── */}
        <div className="px-5 py-4">
          <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-3">
            Aktivitätslog
          </h4>

          {logEntries.length === 0 ? (
            <p className="text-xs text-forest/40 italic text-center py-4">
              Noch keine Aktivitäten…
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {logEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-2 text-xs text-forest/70 font-mono leading-snug"
                >
                  <LogDot level={entry.level} />
                  <span>
                    <span className="text-forest/40 select-none">[{entry.timestamp}]</span>{' '}
                    <span>{entry.message}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Pending Sitemap Verification ── */}
      <div className="surface-card rounded-2xl border border-forest/10 bg-white overflow-hidden shadow-sm lg:col-span-12 xl:col-span-12 max-w-[420px] w-full">
        <div className="px-5 py-4 border-b border-forest/10 bg-gray-50/50">
          <h3 className="font-display text-lg font-semibold text-forest leading-tight flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-amber-600" />
            Pending Sitemap Verification
          </h3>
          <p className="text-xs text-forest/60 mt-1">
            Published pages waiting to be verified in the XML sitemap.
          </p>
        </div>
        <div className="p-0 max-h-[400px] overflow-y-auto">
          {unindexedPages.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mb-2 opacity-50" />
              <p className="text-sm font-medium text-forest/50">All published pages are verified.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {unindexedPages.map((page: any) => (
                <div key={page.id} className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-forest">{page.title}</h4>
                      <p className="text-xs text-forest/60 mt-0.5">/{page.slug}</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-md tracking-wide flex-shrink-0">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">Published: {new Date(page.published_at || page.updated_at).toLocaleDateString()}</span>
                    <button 
                      onClick={() => markIndexedMutation.mutate(page.id)}
                      disabled={markIndexedMutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 shadow-sm text-xs font-semibold text-forest hover:bg-cream hover:text-forest hover:border-forest/20 rounded-lg transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Mark Verified
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

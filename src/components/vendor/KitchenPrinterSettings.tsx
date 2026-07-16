/**
 * KitchenPrinterSettings
 *
 * Restaurant-scoped component. Renders inside SettingsOperationsSection.
 * Allows a restaurant owner to:
 *   1. Register their Star CloudPRNT printer by MAC address
 *   2. See real-time online/offline status from last_heartbeat_at
 *   3. Send a test print job to verify the full flow end-to-end
 *
 * Scope guardrail: Only reads/writes restaurant_printers and restaurant_print_jobs.
 * No catering or planner tables are referenced here.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Printer, Wifi, WifiOff, Loader2, FlaskConical } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrinterRow {
  id: string;
  restaurant_id: string;
  mac_address: string;
  poll_interval_seconds: number;
  last_heartbeat_at: string | null;
  status: "online" | "offline";
  paper_width: number;
}

// ---------------------------------------------------------------------------
// MAC address validation
// Accepts: AA:BB:CC:DD:EE:FF or AA-BB-CC-DD-EE-FF (case-insensitive)
// ---------------------------------------------------------------------------
function isValidMac(mac: string): boolean {
  return /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/.test(mac.trim());
}

function normaliseMac(mac: string): string {
  return mac.trim().toUpperCase().replace(/-/g, ":");
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
function PrinterStatusBadge({
  printer,
  lang,
}: {
  printer: PrinterRow | null | undefined;
  lang: string;
}) {
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  if (!printer) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
        <span className="h-2 w-2 rounded-full bg-gray-400" />
        {tt("Nicht konfiguriert", "Not configured")}
      </span>
    );
  }

  if (printer.status === "online") {
    const lastSeen = printer.last_heartbeat_at
      ? new Date(printer.last_heartbeat_at).toLocaleTimeString(lang === "de" ? "de-DE" : "en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "—";
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        title={tt(`Zuletzt gesehen: ${lastSeen}`, `Last seen: ${lastSeen}`)}
      >
        <Wifi className="h-3.5 w-3.5" />
        {tt("Online", "Online")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
      <WifiOff className="h-3.5 w-3.5" />
      {tt("Offline", "Offline")}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface KitchenPrinterSettingsProps {
  restaurantId: string;
  lang: string;
}

export function KitchenPrinterSettings({ restaurantId, lang }: KitchenPrinterSettingsProps) {
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const qc = useQueryClient();

  const [macInput, setMacInput] = useState("");
  const [macError, setMacError] = useState<string | null>(null);
  const [paperWidthInput, setPaperWidthInput] = useState<"58" | "80">("80");



  // -------------------------------------------------------------------------
  // Load existing printer for this restaurant
  // -------------------------------------------------------------------------
  const { data: printer, isLoading } = useQuery<PrinterRow | null>({
    queryKey: ["restaurant-printer", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurant_printers")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();
      if (error) throw error;
      return data as PrinterRow | null;
    },
    // Refetch every 10 seconds to reflect live heartbeat status without full page reload
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  // -------------------------------------------------------------------------
  // Save / upsert printer MAC
  // -------------------------------------------------------------------------
  const saveMutation = useMutation({
    mutationFn: async (payload: { mac: string; width: number }) => {
      const { error } = await supabase
        .from("restaurant_printers" as any)
        .upsert(
          {
            restaurant_id: restaurantId,
            mac_address: payload.mac,
            paper_width: payload.width,
            status: "offline",
            last_heartbeat_at: null,
          },
          { onConflict: "restaurant_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(tt("Drucker gespeichert!", "Printer saved!"));
      qc.invalidateQueries({ queryKey: ["restaurant-printer", restaurantId] });
    },
    onError: (err: any) => {
      toast.error(err.message ?? tt("Speichern fehlgeschlagen", "Failed to save printer"));
    },
  });

  // -------------------------------------------------------------------------
  // Test print — inserts a pending job for the printer to pick up
  // -------------------------------------------------------------------------
  const testPrintMutation = useMutation({
    mutationFn: async () => {
      if (!printer) throw new Error(tt("Kein Drucker konfiguriert", "No printer configured"));

      // Fetch the most recent confirmed order to use as the test subject
      const { data: latestOrder, error: orderErr } = await supabase
        .from("restaurant_orders")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orderErr) throw orderErr;
      if (!latestOrder) {
        throw new Error(
          tt(
            "Keine bestätigte Bestellung zum Testdruck vorhanden",
            "No confirmed order available for test print",
          ),
        );
      }

      // Insert a print job — the printer will pick it up on its next poll
      const { error: insertErr } = await supabase
        .from("restaurant_print_jobs")
        .insert({
          order_id: latestOrder.id,
          restaurant_id: restaurantId,
          status: "pending",
        });

      // 23505 = already pending — that's fine, the printer will pick it up
      if (insertErr && (insertErr as any).code !== "23505") {
        throw insertErr;
      }
    },
    onSuccess: () => {
      toast.success(
        tt(
          "Testdruck gesendet! Der Drucker sollte innerhalb von 5–10 Sekunden drucken.",
          "Test print sent! The printer should print within 5–10 seconds.",
        ),
      );
    },
    onError: (err: any) => {
      toast.error(err.message ?? tt("Testdruck fehlgeschlagen", "Test print failed"));
    },
  });

  // -------------------------------------------------------------------------
  // Save handler with validation
  // -------------------------------------------------------------------------
  function handleSave() {
    setMacError(null);
    const mac = normaliseMac(macInput);
    if (!isValidMac(mac)) {
      setMacError(
        tt(
          "Ungültige MAC-Adresse. Format: AA:BB:CC:DD:EE:FF",
          "Invalid MAC address. Format: AA:BB:CC:DD:EE:FF",
        ),
      );
      return;
    }
    saveMutation.mutate({ mac, width: Number(paperWidthInput) });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="border border-[#e2e8e4] rounded-2xl overflow-hidden mt-6">
      {/* Card header */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[#f8faf9] border-b border-[#e2e8e4]">
        <div className="flex items-center gap-2.5">
          <Printer className="h-5 w-5 text-forest/70 shrink-0" />
          <div>
            <div className="font-semibold text-forest text-sm">
              {tt("Küchendrucker (CloudPRNT)", "Kitchen Printer (CloudPRNT)")}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {tt(
                "Star Micronics mC-Print3 oder kompatibles CloudPRNT-Gerät",
                "Star Micronics mC-Print3 or compatible CloudPRNT device",
              )}
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <PrinterStatusBadge printer={printer} lang={lang} />
        )}
      </div>

      {/* Card body */}
      <div className="px-6 py-5 space-y-5 bg-white">
        {/* Existing printer info */}
        {printer && (
          <div className="flex items-center justify-between gap-4 p-3 bg-[#f8faf9] rounded-xl border border-[#e2e8e4]">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {tt("Registrierte MAC-Adresse", "Registered MAC Address")}
              </div>
              <div className="font-mono text-sm text-forest font-medium">{printer.mac_address}</div>
            </div>
            {printer.last_heartbeat_at && (
              <div className="text-right space-y-0.5">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {tt("Letztes Signal", "Last Heartbeat")}
                </div>
                <div className="text-xs text-forest/70">
                  {new Date(printer.last_heartbeat_at).toLocaleString(
                    lang === "de" ? "de-DE" : "en-GB",
                    { dateStyle: "short", timeStyle: "medium" },
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAC address input */}
        <div className="space-y-1.5">
          <Label htmlFor="printer-mac-input" className="text-sm font-medium text-forest">
            {printer
              ? tt("MAC-Adresse aktualisieren", "Update MAC Address")
              : tt("MAC-Adresse eingeben", "Enter MAC Address")}
          </Label>
          <div className="flex flex-col gap-4">
            <Input
              id="printer-mac-input"
              placeholder="AA:BB:CC:DD:EE:FF"
              value={macInput}
              onChange={(e) => {
                setMacInput(e.target.value);
                setMacError(null);
              }}
              className="font-mono text-sm max-w-xs"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-forest">
                {tt("Papierbreite", "Paper Width")}
              </Label>
              <RadioGroup
                value={paperWidthInput}
                onValueChange={(val: "58" | "80") => setPaperWidthInput(val)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="80" id="w-80" />
                  <Label htmlFor="w-80" className="font-normal cursor-pointer">
                    80mm ({tt("Standard", "Default")})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="58" id="w-58" />
                  <Label htmlFor="w-58" className="font-normal cursor-pointer">
                    58mm
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              id="printer-save-btn"
              onClick={handleSave}
              disabled={!macInput.trim() || saveMutation.isPending}
              size="sm"
              className="bg-forest text-white hover:bg-forest/90 w-fit shrink-0"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                tt("Speichern", "Save")
              )}
            </Button>
          </div>
          {macError && <p className="text-xs text-destructive">{macError}</p>}
          <p className="text-xs text-muted-foreground">
            {tt(
              "Die MAC-Adresse finden Sie auf der Selbsttest-Seite des Druckers (FEED-Taste beim Einschalten gedrückt halten).",
              "Find the MAC address on the printer's self-test page (hold FEED button while powering on).",
            )}
          </p>
        </div>

        {/* Setup instructions */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 space-y-1">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            {tt("Drucker einrichten", "Printer Setup")}
          </div>
          <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>
              {tt(
                "Öffnen Sie die Drucker-Weboberfläche (IP-Adresse auf dem Selbsttest-Ausdruck)",
                "Open the printer web interface (IP address on the self-test printout)",
              )}
            </li>
            <li>
              {tt(
                'Navigieren Sie zu CloudPRNT → "Server URL"',
                'Navigate to CloudPRNT → "Server URL"',
              )}
            </li>
            <li>
              {tt("Tragen Sie ein:", "Enter:")}{" "}
              <code className="bg-amber-100 px-1 rounded font-mono">
                https://speisely.de/api/print/star
              </code>
            </li>
            <li>
              {tt(
                "Speichern Sie und starten Sie den Drucker neu",
                "Save and restart the printer",
              )}
            </li>
          </ol>
        </div>

        {/* Test print button */}
        {printer && (
          <div className="flex items-center justify-between pt-1 border-t border-[#e2e8e4]">
            <div>
              <div className="text-sm font-medium text-forest">
                {tt("Testdruck senden", "Send Test Print")}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {tt(
                  "Letzte bestätigte Bestellung wird an den Drucker gesendet",
                  "Sends your most recent confirmed order to the printer",
                )}
              </div>
            </div>
            <Button
              id="printer-test-print-btn"
              variant="outline"
              size="sm"
              onClick={() => testPrintMutation.mutate()}
              disabled={testPrintMutation.isPending || printer.status !== "online"}
              className="shrink-0 gap-2 border-forest/20 text-forest hover:bg-forest/5"
              title={
                printer.status !== "online"
                  ? tt(
                      "Drucker muss online sein, um einen Testdruck zu senden",
                      "Printer must be online to send a test print",
                    )
                  : undefined
              }
            >
              {testPrintMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FlaskConical className="h-4 w-4" />
              )}
              {tt("Testdruck", "Test Print")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

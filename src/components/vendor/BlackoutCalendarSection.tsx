import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyBlackoutDates, addBlackoutDate, removeBlackoutDate } from "@/lib/vendor/blackout.functions";

export function BlackoutCalendarSection({ vendorType }: { vendorType: "caterer" | "planner" }) {
  const fetchDates = useServerFn(getMyBlackoutDates);
  const addDate = useServerFn(addBlackoutDate);
  const removeDate = useServerFn(removeBlackoutDate);
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["blackout_dates", vendorType],
    queryFn: () => fetchDates({ data: { vendorType } })
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [reason, setReason] = useState("");
  const [adding, setAdding] = useState(false);

  const blackoutDates = q.data || [];
  const blackoutDateObjects = blackoutDates.map((b: any) => new Date(b.blackout_date));

  const handleAddDates = async () => {
    if (selectedDates.length === 0) return;
    setAdding(true);
    try {
      for (const d of selectedDates) {
        // format to YYYY-MM-DD
        const dateStr = d.toISOString().split("T")[0];
        // Only add if not already blacked out
        if (!blackoutDates.find((b: any) => b.blackout_date === dateStr)) {
          await addDate({ data: { vendorType, date: dateStr, reason } });
        }
      }
      setSelectedDates([]);
      setReason("");
      qc.invalidateQueries({ queryKey: ["blackout_dates", vendorType] });
    } catch (e: any) {
      alert("Error adding dates: " + e.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveDate = async (id: string) => {
    try {
      await removeDate({ data: { blackoutId: id } });
      qc.invalidateQueries({ queryKey: ["blackout_dates", vendorType] });
    } catch (e: any) {
      alert("Error removing date: " + e.message);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-2xl">Blackout Calendar</h2>
        <p className="text-sm text-muted-foreground">Mark dates when you are fully booked or unavailable to prevent customers from requesting these dates.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Column: Calendar Card & Block Control Form */}
        <div className="space-y-4">
          <div className="surface-card p-5 border border-[#eadfce]/35 bg-white rounded-3xl shadow-sm flex flex-col items-center">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates as any}
              disabled={blackoutDateObjects}
              className="rounded-xl border border-border/40 p-3 bg-white"
            />
          </div>
          
          {selectedDates.length > 0 && (
            <div className="surface-card p-4 rounded-2xl bg-cream/10 border border-[#eadfce]/45 text-left space-y-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-250">
              <p className="text-xs font-bold text-forest">Block {selectedDates.length} Selected Date(s)</p>
              <div className="space-y-2">
                <Input 
                  placeholder="Reason (e.g. 'Fully booked')" 
                  value={reason} 
                  onChange={e => setReason(e.target.value)} 
                  className="bg-white border-border/40 focus-visible:ring-emerald-500 text-xs rounded-xl"
                />
                <Button onClick={handleAddDates} disabled={adding} className="w-full rounded-full bg-forest text-xs py-2 h-9 font-semibold text-white">
                  {adding ? "Saving..." : "Confirm Block Availability"}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column: Currently Blocked Dates scrollable list */}
        <div className="surface-card p-6 border border-[#eadfce]/35 bg-white rounded-3xl shadow-sm text-left flex flex-col justify-between min-h-[360px]">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-forest border-b border-border/40 pb-2">
              Currently Blocked Dates
            </h3>
            {blackoutDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center space-y-2">
                <span className="text-xl">📅</span>
                <p className="text-xs italic">No blackout dates set yet.</p>
                <p className="text-[10px] text-muted-foreground max-w-[200px]">Select dates on the calendar on the left to mark your unavailable days.</p>
              </div>
            ) : (
              <div className="grid gap-2 max-h-[350px] overflow-y-auto pr-1">
                {blackoutDates.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-cream/5 hover:border-forest/35 transition">
                    <div>
                      <p className="font-mono text-xs font-bold text-forest">{new Date(b.blackout_date).toLocaleDateString()}</p>
                      {b.reason && <p className="text-[10px] text-muted-foreground mt-0.5">{b.reason}</p>}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      onClick={() => handleRemoveDate(b.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

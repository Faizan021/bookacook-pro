import React, { useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServerFn } from "@tanstack/react-start";
import { updateBriefMilestones } from "@/lib/caterer/queries.functions";

export type Milestone = {
  id: string;
  title: string;
  completed: boolean;
  updated_at?: string | null;
  updated_by?: string | null;
};

export function MilestoneTimeline({
  briefId,
  milestones = [],
  onUpdate,
  isVendor = false,
}: {
  briefId: string;
  milestones?: Milestone[];
  onUpdate: () => void;
  isVendor?: boolean;
}) {
  const updateMilestonesFn = useServerFn(updateBriefMilestones);
  const [items, setItems] = useState<Milestone[]>(milestones || []);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const saveMilestones = async (newItems: Milestone[]) => {
    setSaving(true);
    try {
      await updateMilestonesFn({ data: { briefId, milestones: newItems } });
      setItems(newItems);
      onUpdate();
    } catch (e: any) {
      alert("Failed to update milestones: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleMilestone = (id: string) => {
    const updated = items.map((m) =>
      m.id === id ? { ...m, completed: !m.completed, updated_at: new Date().toISOString() } : m
    );
    saveMilestones(updated);
  };

  const addMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItems = [
      ...items,
      {
        id: crypto.randomUUID(),
        title: newTitle.trim(),
        completed: false,
        updated_at: new Date().toISOString(),
      },
    ];
    setNewTitle("");
    saveMilestones(newItems);
  };

  const removeMilestone = (id: string) => {
    if (!isVendor) return; // Only vendors can remove
    const newItems = items.filter((m) => m.id !== id);
    saveMilestones(newItems);
  };

  // If customer and no milestones, don't show the section heavily
  if (!isVendor && items.length === 0) {
    return null;
  }

  return (
    <div className="surface-card p-5 border-l-4 border-l-brand-orange">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg flex items-center gap-2">
            <span className="text-brand-orange">📅</span> Event Lifecycle Timeline
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Track progress and align on key deliverables for this event.
          </p>
        </div>
        {saving && <span className="text-xs text-muted-foreground animate-pulse">Saving...</span>}
      </div>

      <div className="space-y-3">
        {items.map((m, i) => (
          <div key={m.id} className="flex items-start gap-3 group">
            <button
              onClick={() => toggleMilestone(m.id)}
              className="mt-0.5 text-muted-foreground hover:text-brand-orange transition-colors"
              disabled={saving}
            >
              {m.completed ? (
                <CheckCircle2 className="w-5 h-5 text-forest" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${m.completed ? "line-through text-muted-foreground" : ""}`}>
                {m.title}
              </p>
              {m.updated_at && (
                <p className="text-[10px] text-muted-foreground">
                  Last updated: {new Date(m.updated_at).toLocaleString()}
                </p>
              )}
            </div>
            {isVendor && (
              <button
                onClick={() => removeMilestone(m.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-1"
                disabled={saving}
                title="Remove milestone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {items.length === 0 && isVendor && (
          <p className="text-sm text-muted-foreground italic">No milestones added yet. Add your first milestone below.</p>
        )}

        {isVendor && (
          <form onSubmit={addMilestone} className="mt-4 flex gap-2">
            <Input
              size={Number("sm")}
              className="h-8 text-sm"
              placeholder="e.g. Menu Finalized, Venue Secured..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={saving}
            />
            <Button type="submit" size="sm" className="h-8 shrink-0" disabled={saving || !newTitle.trim()}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type GermanLocation = {
  id: string;
  name: string;
  postal_code: string | null;
  state: string | null;
  lat: string | number | null;
  lng: string | number | null;
  type: string | null;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: GermanLocation) => void;
  label?: string;
  placeholder?: string;
};

export function GermanLocationAutocomplete({
  value,
  onChange,
  onSelect,
  label = "Ort oder Postleitzahl",
  placeholder = "z. B. Berlin, 10115, Paderborn...",
}: Props) {
  const [results, setResults] = useState<GermanLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const search = value.trim();

    if (search.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("german_locations")
        .select("id,name,postal_code,state,lat,lng,type")
        .or(`name.ilike.%${search}%,postal_code.ilike.%${search}%`)
        .order("name", { ascending: true })
        .limit(8);

      if (error) {
        console.error("Location search failed:", error.message);
        setResults([]);
      } else {
        setResults(data ?? []);
        setOpen((data ?? []).length > 0);
      }

      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [value]);

  function handleSelect(location: GermanLocation) {
    const label = `${location.postal_code ? `${location.postal_code} ` : ""}${
      location.name
    }`;

    onChange(label);
    onSelect(location);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-sm font-semibold text-[#173f35]">{label}</label>

      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        placeholder={placeholder}
        className="mt-3 w-full rounded-2xl border border-[#e8dcc8] bg-[#faf6ee] px-5 py-4 outline-none transition focus:border-[#c9a45c]"
      />

      {loading ? (
        <p className="mt-2 text-sm text-[#5c6f68]">Suche Orte...</p>
      ) : null}

      {open && results.length > 0 ? (
        <div className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl">
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => handleSelect(location)}
              className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-[#faf6ee]"
            >
              <div className="font-semibold text-[#173f35]">
                {location.postal_code} {location.name}
              </div>
              <div className="text-sm text-[#5c6f68]">
                {location.state} · {location.type ?? "location"}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

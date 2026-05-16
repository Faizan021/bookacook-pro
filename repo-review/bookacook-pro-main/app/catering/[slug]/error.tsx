"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Etwas ist schiefgelaufen!</h2>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-green-700 text-white rounded">
        Neu laden
      </button>
    </div>
  );
}

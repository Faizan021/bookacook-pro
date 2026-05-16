import { NextRequest, NextResponse } from "next/server";

type Section =
  | "hero"
  | "premium"
  | "caterer"
  | "wedding"
  | "corporate"
  | "birthday"
  | "private"
  | "ramadan"
  | "christmas"
  | "modern-european"
  | "wedding-dining"
  | "corporate-food"
  | "caterer-inquiries";

const SECTION_QUERIES: Record<Section, string> = {
  hero: "luxury catering event elegant table fine dining",
  premium: "fine dining plated food elegant restaurant",
  caterer: "professional catering team hospitality event service",
  wedding: "wedding reception table flowers elegant dinner",
  corporate: "corporate event catering conference buffet",
  birthday: "birthday dinner party table celebration",
  private: "private dinner party elegant table",
  ramadan: "iftar dinner table ramadan food",
  christmas: "festive christmas dinner table holiday party",
  "modern-european": "modern european plated food fine dining",
  "wedding-dining": "elegant wedding catering plated dinner food",
  "corporate-food": "corporate catering buffet business lunch food",
  "caterer-inquiries": "catering chef team serving food event kitchen",
};

const FALLBACK_IMAGES: Record<Section, { url: string; alt: string }> = {
  hero: {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85",
    alt: "Elegant catering table",
  },
  premium: {
    url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=85",
    alt: "Fine dining food presentation",
  },
  caterer: {
    url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=85",
    alt: "Professional catering team preparing food",
  },
  wedding: {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    alt: "Elegant wedding table",
  },
  corporate: {
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85",
    alt: "Corporate event space",
  },
  birthday: {
    url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85",
    alt: "Birthday celebration",
  },
  private: {
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85",
    alt: "Private dinner party",
  },
  ramadan: {
    url: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=85",
    alt: "Shared dinner table",
  },
  christmas: {
    url: "https://images.unsplash.com/photo-1481930916222-5ec4696fc0f2?auto=format&fit=crop&w=1200&q=85",
    alt: "Festive Christmas dinner table",
  },
  "modern-european": {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85",
    alt: "Modern European plated food",
  },
  "wedding-dining": {
    url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=85",
    alt: "Elegant wedding catering food",
  },
  "corporate-food": {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85",
    alt: "Corporate catering food",
  },
  "caterer-inquiries": {
    url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=85",
    alt: "Caterer preparing fresh food for an event",
  },
};

function isSection(value: string | null): value is Section {
  return Boolean(value && value in SECTION_QUERIES);
}

export async function GET(request: NextRequest) {
  const sectionParam = request.nextUrl.searchParams.get("section");
  const section: Section = isSection(sectionParam) ? sectionParam : "hero";

  if (section === "christmas") {
    return NextResponse.json({
      section,
      source: "fixed-fallback",
      ...FALLBACK_IMAGES.christmas,
    });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json({
      section,
      source: "fallback",
      ...FALLBACK_IMAGES[section],
    });
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", SECTION_QUERIES[section]);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("per_page", "12");
    url.searchParams.set("content_filter", "high");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        section,
        source: "fallback",
        ...FALLBACK_IMAGES[section],
      });
    }

    const data = await response.json();
    const results = data?.results ?? [];

    if (!results.length) {
      return NextResponse.json({
        section,
        source: "fallback",
        ...FALLBACK_IMAGES[section],
      });
    }

    const indexBySection: Record<Section, number> = {
      hero: 0,
      premium: 1,
      caterer: 2,
      wedding: 3,
      corporate: 4,
      birthday: 5,
      private: 6,
      ramadan: 7,
      christmas: 8,
      "modern-european": 9,
      "wedding-dining": 10,
      "corporate-food": 11,
      "caterer-inquiries": 5,
    };

    const image = results[indexBySection[section] % results.length];

    return NextResponse.json({
      section,
      source: "unsplash",
      url: image.urls.regular,
      alt:
        image.alt_description ||
        image.description ||
        FALLBACK_IMAGES[section].alt,
    });
  } catch {
    return NextResponse.json({
      section,
      source: "fallback",
      ...FALLBACK_IMAGES[section],
    });
  }
}

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
  | "christmas";

const SECTION_QUERIES: Record<Section, string> = {
  hero: "luxury catering event elegant table fine dining",
  premium: "fine dining plated food elegant restaurant",
  caterer: "professional chef catering kitchen team",
  wedding: "wedding reception table flowers elegant dinner",
  corporate: "corporate event catering conference buffet",
  birthday: "birthday dinner party table celebration",
  private: "private dinner party elegant table",
  ramadan: "iftar dinner table ramadan food",
  christmas: "christmas dinner table festive catering",
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
    url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1600&q=85",
    alt: "Professional chef preparing food",
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
    url: "https://images.unsplash.com/photo-1543934638-0cf8f8f9b6d1?auto=format&fit=crop&w=1200&q=85",
    alt: "Christmas dinner table",
  },
};

function isSection(value: string | null): value is Section {
  return Boolean(value && value in SECTION_QUERIES);
}

export async function GET(request: NextRequest) {
  const sectionParam = request.nextUrl.searchParams.get("section");
  const section: Section = isSection(sectionParam) ? sectionParam : "hero";

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json({
      section,
      source: "fallback",
      ...FALLBACK_IMAGES[section],
    });
  }

  try {
    const query = SECTION_QUERIES[section];

    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
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

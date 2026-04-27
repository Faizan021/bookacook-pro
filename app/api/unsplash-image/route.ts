import { NextResponse } from "next/server";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

type UnsplashPhoto = {
  id: string;
  alt_description: string | null;
  description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
};

function getQueryForSection(section: string) {
  switch (section) {
    case "hero":
      return "luxury catering event elegant dinner table";
    case "premium":
      return "fine dining plated dinner catering";
    case "caterer":
      return "professional catering team kitchen hospitality";
    case "wedding":
      return "wedding catering elegant reception";
    case "corporate":
      return "corporate catering business event buffet";
    case "birthday":
      return "birthday catering celebration food";
    case "private":
      return "private dinner catering";
    case "ramadan":
      return "iftar dinner catering ramadan table";
    default:
      return "premium catering";
  }
}

export async function GET(req: Request) {
  if (!ACCESS_KEY) {
    return NextResponse.json(
      { error: "Missing UNSPLASH_ACCESS_KEY" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section") || "hero";
  const query = getQueryForSection(section);

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", "10");
  url.searchParams.set("orientation", "landscape");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "Unsplash request failed", details: text },
      { status: response.status }
    );
  }

  const data = await response.json();
  const results = (data.results || []) as UnsplashPhoto[];

  if (!results.length) {
    return NextResponse.json({ image: null });
  }

  const photo = results[0];

  // Better than full, stable for homepage
  const imageUrl = `${photo.urls.raw}&w=1600&auto=format&q=80`;

  return NextResponse.json({
    image: {
      id: photo.id,
      src: imageUrl,
      alt:
        photo.alt_description ||
        photo.description ||
        `${section} catering image`,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      photoUrl: photo.links.html,
    },
  });
}

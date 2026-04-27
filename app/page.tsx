{/* --- Refined Hero Section --- */}
<section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#2d4736]">
  {/* The Background Image with a proper Fallback */}
  <Image
    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop"
    alt="Premium Catering"
    fill
    priority
    className="object-cover object-center opacity-60" 
  />
  
  {/* Sophisticated Gradient Overlay to blend the image into the background */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#f5f1ea]" />

  <div className="relative z-10 w-full max-w-7xl px-6 py-20 text-center">
    <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2dfbf] backdrop-blur-md">
      <Sparkles className="h-3.5 w-3.5" />
      {t("home.badge")}
    </div>

    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white">
      {t("home.editorialHeroTitle")}
    </h1>
    
    <p className="mt-6 mx-auto max-w-2xl text-lg text-white/80">
      {/* Add a short sub-headline here from your translations if available */}
      {t("home.heroSubtitle", "Speisely transforms your vision into a precise catering briefing.")}
    </p>

    {/* Search Console - Ensuring it stands out against the dark background */}
    <form onSubmit={handleSearch} className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={heroQuery}
          onChange={(e) => setHeroQuery(e.target.value)}
          placeholder={t("home.editorialSearchPlaceholder")}
          className="h-14 flex-[2] rounded-2xl bg-white px-6 text-base focus:outline-none focus:ring-2 focus:ring-[#c49840]"
        />
        <button type="submit" className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#c49840] px-8 font-bold text-white hover:bg-[#b38a3a] transition-all">
          {t("home.heroSearchCta")}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  </div>
</section>

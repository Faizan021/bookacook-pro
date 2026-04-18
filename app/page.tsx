<section className="relative overflow-hidden bg-[#0f1a12]">
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(168,112,64,0.16),transparent_30%),radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,rgba(10,18,12,0.88)_0%,rgba(10,18,12,0.92)_100%)]" />
    <Image
      src="/images/speisely-hero.png"
      alt={t("home.images.heroAlt")}
      fill
      priority
      className="object-cover opacity-18 mix-blend-soft-light"
    />
  </div>

  <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#a87040]/35 bg-white/6 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f3ddbf]">
        <SparklesIcon />
        <span>{t("home.badge")}</span>
      </div>

      <h1 className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl xl:text-[4.75rem]">
        {t("home.editorialHeroTitle")}
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
        {t("home.editorialHeroSubtitle")}
      </p>

      <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/7 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 rounded-[1.2rem] bg-[#fbf7f0] px-4 py-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 text-[#6b6255]">
            <SearchIcon />
          </div>

          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={t("home.editorialSearchPlaceholder")}
            className="w-full bg-transparent text-sm text-[#161610] placeholder:text-[#7b7367] focus:outline-none"
          />

          <button
            onClick={handleAiSubmit}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#2a4a2c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#335a37]"
          >
            {t("home.guided.cta")}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setAiQuery(prompt)}
              className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/88 transition hover:border-[#a87040]/40 hover:bg-white/12"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/74">
        <span>{t("home.heroBenefit1")}</span>
        <span className="h-1 w-1 rounded-full bg-[#c59b47]" />
        <span>{t("home.heroBenefit2")}</span>
        <span className="h-1 w-1 rounded-full bg-[#c59b47]" />
        <span>{t("home.heroBenefit3")}</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/request/new"
          className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#f2eadb]"
        >
          {t("home.heroPlanCta")}
        </Link>

        <Link
          href="/caterers"
          className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-white/18 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
        >
          {t("home.heroBrowseCta")}
        </Link>
      </div>
    </div>

    <div className="hidden lg:grid gap-5">
      <Link
        href="/caterers?occasion=wedding"
        className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
      >
        <div className="relative h-[250px]">
          <Image
            src="/images/speisely-wedding.png"
            alt={t("home.occasions.wedding")}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,22,15,0.88)] via-[rgba(14,22,15,0.28)] to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[#e3bf87]">
            {t("home.occasions.wedding")}
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">Elegant weddings</div>
          <div className="mt-2 max-w-sm text-sm leading-7 text-white/82">
            {t("home.occasions.weddingDesc")}
          </div>
        </div>
      </Link>

      <Link
        href="/caterers?occasion=corporate"
        className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
      >
        <div className="relative h-[220px]">
          <Image
            src="/images/speisely-business.png"
            alt={t("home.occasions.corporate")}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,22,15,0.88)] via-[rgba(14,22,15,0.28)] to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="text-xs uppercase tracking-[0.2em] text-[#e3bf87]">
            {t("home.occasions.corporate")}
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">Business events</div>
          <div className="mt-2 max-w-sm text-sm leading-7 text-white/82">
            {t("home.occasions.corporateDesc")}
          </div>
        </div>
      </Link>
    </div>
  </div>
</section>

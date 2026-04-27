<section className="bg-[#faf6ee] py-24 text-[#16372f]">
  <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b28a3c]">
        {t("home.premium.label", "Premium-Präsentation")}
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        {t(
          "home.premium.title",
          "Catering ist emotional. Die Buchung sollte hochwertig wirken."
        )}
      </h2>

      <p className="mt-6 text-lg leading-8 text-[#5c6f68]">
        {t(
          "home.premium.text",
          "Speisely kombiniert elegante Präsentation mit klarer Marketplace-Logik: Pakete, strukturierte Anfragen, verifizierte Caterer und eine geführte Customer Journey."
        )}
      </p>
    </div>

    <DynamicUnsplashImage
      section="premium"
      className="h-[480px] rounded-[2rem] shadow-sm"
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  </div>
</section>

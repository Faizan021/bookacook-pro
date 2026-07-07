import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { getUserProfile } from "@/lib/auth/get-user-profile.functions";
import { getPartnerWorkspaces } from "@/lib/auth/workspace.functions";
import { Store, ChefHat, CalendarHeart, PlusCircle, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  ssr: false,
  beforeLoad: async () => {
    const profile = await getUserProfile();
    if (profile.primaryRole !== "partner") {
      throw redirect({ to: "/customer" });
    }
  },
  loader: async () => {
    const workspaces = await getPartnerWorkspaces();
    return { workspaces };
  },
  component: PartnerHub,
});

function PartnerHub() {
  const { workspaces } = Route.useLoaderData();
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const cards = [
    {
      title: tt("Restaurant", "Restaurant"),
      desc: tt("Bestellungen & Tische", "Orders & Reservations"),
      icon: Store,
      active: workspaces.restaurant,
      name: workspaces.restaurantName,
      link: "/restaurant",
    },
    {
      title: tt("Catering", "Catering"),
      desc: tt("Catering-Anfragen", "Catering Briefs"),
      icon: ChefHat,
      active: workspaces.caterer,
      name: workspaces.catererName,
      link: "/caterer",
    },
    {
      title: tt("Event Planner", "Event Planner"),
      desc: tt("Dienstleistungen & Events", "Services & Events"),
      icon: CalendarHeart,
      active: workspaces.planner,
      name: workspaces.plannerName,
      link: "/dashboard/planner",
    },
  ];

  return (
    <SiteShell>
      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-forest mb-2">
                {tt("Partner Hub", "Partner Hub")}
              </h1>
              <p className="text-forest/70">
                {tt(
                  "Verwalten Sie Ihre aktiven Arbeitsbereiche oder fügen Sie neue Dienstleistungen hinzu.",
                  "Manage your active workspaces or add new services.",
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#eadfce] overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[#b28a3c]/50"
                >
                  <div className="p-6 flex-grow space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F6F5F2] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#b28a3c]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-forest">{card.title}</h3>
                      <p className="text-sm text-forest/70 mt-1">{card.desc}</p>
                    </div>

                    {card.active && card.name && (
                      <div className="bg-forest/5 px-3 py-2 rounded-lg mt-4 inline-block">
                        <span className="text-xs font-semibold text-forest/90 uppercase tracking-wider">
                          {tt("Aktiv: ", "Active: ")}
                        </span>
                        <span className="text-sm text-forest font-medium">{card.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-[#F6F5F2]/50 border-t border-[#eadfce]">
                    {card.active ? (
                      <Link
                        to={card.link}
                        className="flex items-center justify-center w-full gap-2 py-2 px-4 bg-forest text-white rounded-lg hover:bg-forest/90 transition font-medium"
                      >
                        {tt("Arbeitsbereich öffnen", "Open Workspace")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        to={card.link} // We will handle the "setup/onboarding" within those routes if data doesn't exist
                        className="flex items-center justify-center w-full gap-2 py-2 px-4 bg-white border border-[#b28a3c] text-[#b28a3c] rounded-lg hover:bg-[#b28a3c]/10 transition font-medium"
                      >
                        <PlusCircle className="w-4 h-4" />
                        {tt("Aktivieren", "Activate")}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

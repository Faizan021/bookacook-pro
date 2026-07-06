import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery, useMutation, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { 
  getVendorRestaurantReviews, 
  submitRestaurantVendorReply, 
  flagRestaurantReview 
} from "@/lib/reviews/vendor.functions";
import { getUserProfile } from "@/lib/auth/get-user-profile.functions";
import { VendorLayout } from "@/components/vendor/VendorLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { toast } from "sonner";

const reviewsQueryOptions = queryOptions({
  queryKey: ["vendorRestaurantReviews"],
  queryFn: () => getVendorRestaurantReviews(),
});

export const Route = createFileRoute("/_authenticated/restaurant/reviews")({
  beforeLoad: async () => {
    const profile = await getUserProfile();
    if (!profile.roles.includes("restaurant_owner")) {
      throw redirect({ to: "/auth", search: { logout: "true" } as any });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(reviewsQueryOptions);
  },
  component: RestaurantReviewsDashboard,
});

function ReviewCard({ review }: { review: any }) {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();

  const submitReply = useServerFn(submitRestaurantVendorReply);
  const flagReview = useServerFn(flagRestaurantReview);

  const replyMutation = useMutation({
    mutationFn: (reply: string) => submitReply({ data: { reviewId: review.id, reply } }),
    onSuccess: () => {
      toast.success(t("Antwort veröffentlicht", "Reply published"));
      setShowReplyForm(false);
      queryClient.invalidateQueries({ queryKey: ["vendorRestaurantReviews"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const flagMutation = useMutation({
    mutationFn: () => flagReview({ data: { reviewId: review.id } }),
    onSuccess: () => {
      toast.success(t("Zur Moderation gemeldet", "Flagged for moderation"));
      queryClient.invalidateQueries({ queryKey: ["vendorRestaurantReviews"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-forest/10 mb-6 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-display font-semibold text-forest text-lg">
            {review.customer_name || t("Gast", "Guest")}
          </h4>
          <div className="text-xs text-forest/60 mt-1">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-bold">
          <Star className="h-4 w-4 fill-current" />
          <span>{review.overall_rating} / 5</span>
        </div>
      </div>
      
      <p className="text-forest/80 italic border-l-2 border-forest/20 pl-4 py-1">
        "{review.comment}"
      </p>

      {/* Status Badges */}
      <div className="flex items-center gap-2 mt-2">
        {review.status === "published" && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            {t("Veröffentlicht", "Published")}
          </span>
        )}
        {review.status === "pending_moderation" && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3" />
            {t("In Prüfung", "Pending Moderation")}
          </span>
        )}
        {review.status === "flagged" && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3" />
            {t("Gemeldet", "Flagged")}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-forest/10 flex flex-col gap-4">
        {review.vendor_reply ? (
          <div className="bg-forest/5 p-4 rounded-xl">
            <div className="text-xs font-semibold text-forest mb-2 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" />
              {t("Ihre Antwort", "Your Reply")}
            </div>
            <p className="text-sm text-forest/80">{review.vendor_reply}</p>
          </div>
        ) : (
          review.status === "published" && (
            <div className="flex flex-col gap-3">
              {!showReplyForm ? (
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setShowReplyForm(true)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("Antworten", "Reply")}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(t("Möchten Sie diese Bewertung zur Moderation melden?", "Are you sure you want to flag this review for moderation?"))) {
                        flagMutation.mutate();
                      }
                    }}
                    disabled={flagMutation.isPending}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {t("Melden", "Flag")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Textarea
                    placeholder={t("Ihre Antwort wird öffentlich sichtbar sein...", "Your reply will be publicly visible...")}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>
                      {t("Abbrechen", "Cancel")}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => replyMutation.mutate(replyText)}
                      disabled={!replyText.trim() || replyMutation.isPending}
                    >
                      {replyMutation.isPending ? t("Wird gesendet...", "Sending...") : t("Senden", "Submit")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function RestaurantReviewsDashboard() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const { data: reviews } = useSuspenseQuery(reviewsQueryOptions);

  const published = reviews.filter((r: any) => r.status === "published");
  const pendingOrFlagged = reviews.filter((r: any) => r.status !== "published");

  return (
    <VendorLayout title={t("Bewertungen", "Reviews")} vertical="restaurant">
      <div className="max-w-4xl space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-forest">
            {t("Kundenbewertungen", "Customer Reviews")}
          </h2>
          <Link to="/restaurant" search={{ tab: undefined }} className="text-sm font-semibold text-forest underline">
            {t("Zurück zum Dashboard", "Back to Dashboard")}
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-forest/10 text-center">
            <MessageSquare className="h-10 w-10 text-forest/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-forest font-semibold mb-2">
              {t("Noch keine Bewertungen", "No reviews yet")}
            </h3>
            <p className="text-forest/70">
              {t("Sobald Kunden Bewertungen hinterlassen, erscheinen sie hier.", "Once customers leave reviews, they will appear here.")}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pendingOrFlagged.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-forest flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {t("In Prüfung / Gemeldet", "Under Review / Flagged")}
                </h3>
                {pendingOrFlagged.map((r: any) => <ReviewCard key={r.id} review={r} />)}
              </section>
            )}

            <section>
              <h3 className="text-lg font-bold text-forest flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {t("Veröffentlichte Bewertungen", "Published Reviews")}
              </h3>
              {published.length === 0 ? (
                <p className="text-forest/60 italic">{t("Keine veröffentlichten Bewertungen.", "No published reviews.")}</p>
              ) : (
                published.map((r: any) => <ReviewCard key={r.id} review={r} />)
              )}
            </section>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}

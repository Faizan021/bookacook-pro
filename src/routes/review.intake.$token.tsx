import { createFileRoute } from "@tanstack/react-router";
import { getReviewIntakeData, submitReview } from "@/lib/reviews/server.functions";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/review/intake/$token")({
  loader: async ({ params }) => {
    return getReviewIntakeData({ data: { token: params.token } });
  },
  errorComponent: ({ error }) => {
    let message = "An error occurred while loading this review link.";
    if (error.message.includes("invalid_token")) message = "This review link is invalid or malformed.";
    if (error.message.includes("expired")) message = "This review link has expired.";
    if (error.message.includes("already_consumed")) message = "This review link has already been used.";

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">Cannot Load Review Form</h1>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  },
  component: ReviewIntakeForm,
});

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="mb-4">
      <Label className="block mb-2 font-medium">{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 focus:outline-none`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewIntakeForm() {
  const { token } = Route.useParams();
  const data = Route.useLoaderData();
  const submitFn = useServerFn(submitReview);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState("");

  // Dimensional states
  const [foodQualityRating, setFoodQualityRating] = useState(5);
  const [speedRating, setSpeedRating] = useState(5);
  const [reliabilityRating, setReliabilityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [creativityRating, setCreativityRating] = useState(5);
  const [executionRating, setExecutionRating] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if ((data.role === "caterer" || data.role === "planner") && comment.length < 50) {
      setError("Please write at least 50 characters in your review.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload: any = { token, overallRating, comment };

      if (data.role === "restaurant") {
        payload.foodQualityRating = foodQualityRating;
        payload.speedRating = speedRating;
      } else if (data.role === "caterer") {
        payload.foodRating = foodQualityRating; // reuse state
        payload.reliabilityRating = reliabilityRating;
        payload.communicationRating = communicationRating;
        payload.valueRating = valueRating;
      } else if (data.role === "planner") {
        payload.creativityRating = creativityRating;
        payload.executionRating = executionRating;
        payload.communicationRating = communicationRating;
        payload.valueRating = valueRating;
      }

      await submitFn({ data: payload });
      setSuccess(true);
    } catch (err: any) {
      let msg = "An unexpected error occurred.";
      if (err.message.includes("blocked_self_review")) msg = "You cannot review your own business.";
      else if (err.message.includes("duplicate_review")) msg = "A review has already been submitted for this order.";
      else if (err.message.includes("expired")) msg = "This invite has expired.";
      else if (err.message.includes("already_consumed")) msg = "This invite has already been used.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-sm max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Thank you!</h1>
          <p className="text-gray-600">Your review has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review {data.vendorName}</h1>
          <p className="text-gray-500 mb-8">Share your experience to help others.</p>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <StarRating value={overallRating} onChange={setOverallRating} label="Overall Rating" />

            {data.role === "restaurant" && (
              <div className="grid grid-cols-2 gap-4">
                <StarRating value={foodQualityRating} onChange={setFoodQualityRating} label="Food Quality" />
                <StarRating value={speedRating} onChange={setSpeedRating} label="Speed & Packaging" />
              </div>
            )}

            {data.role === "caterer" && (
              <div className="grid grid-cols-2 gap-4">
                <StarRating value={foodQualityRating} onChange={setFoodQualityRating} label="Food & Presentation" />
                <StarRating value={reliabilityRating} onChange={setReliabilityRating} label="Reliability & Punctuality" />
                <StarRating value={communicationRating} onChange={setCommunicationRating} label="Communication" />
                <StarRating value={valueRating} onChange={setValueRating} label="Value for Money" />
              </div>
            )}

            {data.role === "planner" && (
              <div className="grid grid-cols-2 gap-4">
                <StarRating value={creativityRating} onChange={setCreativityRating} label="Creativity & Vision" />
                <StarRating value={executionRating} onChange={setExecutionRating} label="Execution & Logistics" />
                <StarRating value={communicationRating} onChange={setCommunicationRating} label="Communication" />
                <StarRating value={valueRating} onChange={setValueRating} label="Value for Money" />
              </div>
            )}

            <div>
              <Label className="block mb-2 font-medium">Your Review</Label>
              <Textarea
                rows={5}
                required
                placeholder="Tell us what you liked or what could be improved..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {(data.role === "caterer" || data.role === "planner") && (
                <p className="text-xs text-gray-500 mt-2">
                  {comment.length}/50 minimum characters required for this service type.
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

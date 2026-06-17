import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Feedback | Do The Math",
  description: "Help us improve Do The Math by sharing your feedback.",
};

export default function FeedbackPage() {
  return (
    <div className="py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-neutral-900">Share your feedback</h1>
      <p className="mt-3 text-neutral-600 leading-relaxed">
        We're constantly improving Do The Math and your feedback shapes what we build next.
        Tell us what's working, what's not, or anything you'd like to see.
      </p>

      <div className="mt-10">
        <FeedbackForm />
      </div>
    </div>
  );
}

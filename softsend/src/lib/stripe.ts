import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const CREDIT_PACKS = [
  {
    id: "single",
    credits: 1,
    price: 100, // cents
    label: "1 Rewrite",
    description: "One awkward message fixed",
  },
  {
    id: "pack10",
    credits: 10,
    price: 700,
    label: "10 Credits",
    description: "Best for regular use",
  },
  {
    id: "pack50",
    credits: 50,
    price: 2500,
    label: "50 Credits",
    description: "Best value",
  },
] as const;

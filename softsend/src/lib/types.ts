export type Tone = 
  | "friendly"
  | "professional"
  | "apologetic"
  | "direct"
  | "warm"
  | "casual";

export interface RewriteHistoryItem {
  id: string;
  original: string;
  rewritten: string;
  tone: Tone;
  createdAt: string;
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  label: string;
  priceId?: string; // Stripe Price ID
}

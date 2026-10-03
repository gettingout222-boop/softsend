import Anthropic from "@anthropic-ai/sdk";
import type { Tone } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  friendly: "Make it warm, approachable, and friendly while staying natural.",
  professional: "Make it polished, clear, and professional without sounding stiff.",
  apologetic: "Make it sincere and apologetic while keeping dignity.",
  direct: "Make it clear, concise, and straightforward.",
  warm: "Make it caring, empathetic, and warm.",
  casual: "Make it relaxed, conversational, and easy-going.",
};

export async function rewriteMessage(
  original: string,
  tone: Tone
): Promise<string> {
  const system = `You are SoftSend, an expert at rewriting awkward or unclear messages so they sound natural, clear, and human.

Rules:
- Keep the original meaning and intent exactly.
- Remove awkwardness, stiffness, or confusion.
- Match the requested tone: ${TONE_INSTRUCTIONS[tone]}
- Sound like a real person texting or emailing, not a robot.
- Do not add extra explanations, disclaimers, or commentary.
- Return ONLY the rewritten message.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    system,
    messages: [
      {
        role: "user",
        content: `Rewrite this message:\n\n${original}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }
  return textBlock.text.trim();
}

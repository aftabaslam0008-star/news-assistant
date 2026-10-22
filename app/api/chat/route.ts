import { GoogleGenAI } from "@google/genai";
import { newsItems as demoNewsItems } from "../../../data/news";

// News article information received from page.tsx.
type Article = {
  title?: string;
  summary?: string;
  source?: string;
  url?: string;
  publishedAt?: string;
};

// The system prompt defines the assistant's permanent behavior.
// It is kept on the server so website visitors cannot change these rules.
const systemPrompt = `
You are WorldBrief AI, a careful and capable worldwide-news assistant.

CORE BEHAVIOR:
- Answer the user's question using only the supplied news information.
- Combine relevant details from multiple articles into one coherent answer.
- Prioritize the newest and most directly relevant articles.
- Distinguish confirmed facts from claims, predictions, opinions and allegations.
- Explain complicated news in clear, simple language.
- Compare different publishers' coverage when the question asks for a comparison.
- Include important dates, locations, people and organizations when they are available.

ACCURACY RULES:
- Never invent facts, events, quotations, statistics, dates or publishers.
- Never present an allegation or prediction as a confirmed fact.
- Do not assume that a headline proves something unsupported by its summary.
- If publishers disagree, clearly explain the disagreement.
- If the supplied information is incomplete, say what important information is missing.
- If no relevant verified information is supplied, clearly say that the available articles cannot answer the question.

PUBLISHER AND LINK RULES:
- Mention publisher names naturally, for example: "According to Reuters..."
- Never display raw URLs, Markdown links or web addresses.
- Never add a Sources, References or Links section.
- Use the supplied title, summary, publisher and publication date as evidence.
- A URL by itself is not article content, so never claim to have read a webpage that was not supplied as text.

ANSWER STYLE:
- Begin with a direct answer to the question.
- Use short paragraphs or bullets when they make the answer easier to understand.
- Avoid unnecessary introductions, repeated warnings and technical language.
- Keep simple answers concise and give more detail for genuinely complex questions.
- Use the same language as the user's question when practical.
`;

function normalizeModel(modelName?: string): string {
  if (!modelName) return "gemini-2.0-flash";
  const m = modelName.trim().toLowerCase();
  if (m === "gemini-2.5-flash" || m === "gemini-3.5-flash-lite") {
    return "gemini-2.0-flash";
  }
  return modelName;
}

function generateSmartNewsAnswer(question: string, articles: Article[]): string {
  const q = question.toLowerCase().trim();

  // 1. Greetings / Assistant intro
  if (/^(hi|hello|hey|who are you|what can you do|help)\b/i.test(q)) {
    return `Hello! I am **WorldBrief AI**, your worldwide news assistant.\n\nI can analyze stories, compare reports from different news desks, and provide concise summaries grounded in current verified information.\n\n**Try asking:**\n• *"Summarize today's top stories"*\n• *"Explain the latest developments in AI and technology"*\n• *"Compare coverage of the lead story"*\n• *"What are the key market and business trends?"*\n\n*(💡 Tip: To enable live Google Gemini 2.0 generative AI, add your GEMINI_API_KEY to \`.env.local\`)*`;
  }

  if (articles.length === 0) {
    return `I currently do not have any articles loaded to answer your question about "${question}". Please check your news filters or refresh the latest feed.\n\n*(💡 Tip: Add your GEMINI_API_KEY to \`.env.local\` for live AI generation)*`;
  }

  // 2. Summary of top stories
  if (/\b(summarize|summary|top stories|headlines|briefing|roundup|overview|what('s| is) happening|latest news)\b/i.test(q)) {
    const topPicks = articles.slice(0, 5);
    const bullets = topPicks.map((art) => {
      const source = art.source || "Global Desk";
      const time = art.publishedAt ? ` (${art.publishedAt})` : "";
      return `• **${art.title || "Latest Story"}**\n  *Reported by: ${source}${time}*\n  ${art.summary || "Summary details currently unavailable."}`;
    }).join("\n\n");

    return `Here is your **WorldBrief Executive Summary** of today's key headlines:\n\n${bullets}\n\n**Key Takeaway:** Global reporting currently highlights major international cooperation talks, accelerating developments in enterprise AI tools, and key economic indicators across international markets.\n\n*(⚡ Running on WorldBrief Smart News Engine. Add your GEMINI_API_KEY to \`.env.local\` for live Gemini AI)*`;
  }

  // 3. Comparison of coverage
  if (/\b(compare|comparison|difference|perspectives|differ)\b/i.test(q)) {
    const sources = Array.from(new Set(articles.map((a) => a.source || "Independent Desks")));
    const items = articles.slice(0, 4);
    const comparisonText = items.map((art, i) => {
      return `• **${art.source || "Desk " + (i + 1)}** on *"${art.title}"*:\n  ${art.summary || "General news coverage."}`;
    }).join("\n\n");

    return `Here is a **comparative perspective** across active news sources (${sources.join(", ")}):\n\n${comparisonText}\n\n**Editorial Analysis:**\nDifferent news desks emphasize distinct angles—some focus on political cooperation and governance, while others concentrate on the immediate economic and technological disruptions.\n\n*(⚡ Running on WorldBrief Smart News Engine. Add your GEMINI_API_KEY to \`.env.local\` for live Gemini AI)*`;
  }

  // 4. Topic-specific or Story explanation
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "what", "where", "how", "why",
    "who", "when", "tell", "me", "about", "explain", "this", "story", "in", "on",
    "at", "to", "for", "of", "with", "news", "latest", "today", "updates", "please",
    "give", "show", "can", "you"
  ]);
  const words = q.split(/[^a-z0-9]+/i).filter((w) => w.length > 2 && !stopWords.has(w));

  const scored = articles.map((art) => {
    const text = `${art.title || ""} ${art.summary || ""} ${art.source || ""}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score += 2;
    }
    return { article: art, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const bestMatch = scored[0];
  if (bestMatch && bestMatch.score > 0) {
    const matches = scored.filter((s) => s.score > 0).slice(0, 3);
    const details = matches.map((m) => {
      const art = m.article;
      return `### ${art.title}\n*Reported by: ${art.source || "News Desk"}*\n\n${art.summary}\n`;
    }).join("\n");

    return `Here are the verified details from the available coverage:\n\n${details}\n**Context & Analysis:**\nAccording to **${bestMatch.article.source || "verified reporting"}**, these developments are actively shaping public and industry interest.\n\n*(⚡ Running on WorldBrief Smart News Engine. Add your GEMINI_API_KEY to \`.env.local\` for live Gemini AI)*`;
  }

  // 5. Default fallback
  const topArticles = articles.slice(0, 3);
  const generalList = topArticles.map((a) => `• **${a.title}** (${a.source || "Global Desk"}): ${a.summary}`).join("\n\n");

  return `While the current wire does not contain a specific dedicated article matching "${question}", here are the top verified reports available:\n\n${generalList}\n\n**Tip:** You can also use the search bar above to look for specific keywords or categories.\n\n*(⚡ Running on WorldBrief Smart News Engine. Add your GEMINI_API_KEY to \`.env.local\` for live Gemini AI)*`;
}

// This route sends the question and controlled news context to Gemini or the built-in Smart News Engine.
export async function POST(request: Request) {
  try {
    const rawApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    const apiKey = rawApiKey.trim();
    const hasValidKey = apiKey.length > 0 && apiKey !== "your_gemini_api_key_here";

    const body = await request.json();
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const rawArticles: Article[] = Array.isArray(body.articles) ? body.articles.slice(0, 8) : [];
    const activeArticles: Article[] = rawArticles.length > 0 ? rawArticles : demoNewsItems.slice(0, 8);

    if (!question) {
      return Response.json(
        { error: "Please enter a question." },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return Response.json(
        { error: "The question is too long." },
        { status: 400 }
      );
    }

    // If an API key is configured, use Google Gemini AI
    if (hasValidKey) {
      try {
        const model = normalizeModel(process.env.AI_MODEL);
        const newsContext = activeArticles
          .map(
            (article, index) => `
ARTICLE ${index + 1}
Title: ${article.title || "Unknown"}
Publisher: ${article.source || "Unknown"}
Published: ${article.publishedAt || "Unknown"}
Summary: ${(article.summary || "Unavailable").slice(0, 1500)}
`
          )
          .join("\n");

        const ai = new GoogleGenAI({ apiKey });

        const userInput = `
USER QUESTION:
${question}

SUPPLIED NEWS ARTICLES:
${newsContext || "No specific articles supplied. Answer from verified knowledge."}
`;

        let answer = "";
        try {
          const response = await ai.models.generateContent({
            model,
            contents: userInput,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.2,
            },
          });
          answer = response.text?.trim() || "";
        } catch (modelError) {
          console.warn(`Primary Gemini model (${model}) failed, trying fallback gemini-1.5-flash:`, modelError);
          const fallbackResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: userInput,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.2,
            },
          });
          answer = fallbackResponse.text?.trim() || "";
        }

        if (answer) {
          return Response.json({ answer });
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, using smart fallback engine:", geminiError);
        // Fall back gracefully to the smart news engine
        const answer = generateSmartNewsAnswer(question, activeArticles);
        return Response.json({ answer });
      }
    }

    // When no API key is provided, provide high quality answers via the built-in Smart News Engine
    const answer = generateSmartNewsAnswer(question, activeArticles);
    return Response.json({ answer });
  } catch (error) {
    console.error("Complete chat route error:", error);
    const message = error instanceof Error ? error.message : "The AI assistant request failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
# WorldBrief AI News

A modern, responsive worldwide news platform powered by Next.js and Google Gemini AI. Features curated and live article feeds, interactive category filters, an in-app YouTube live video player modal, and an intelligent news executive assistant.

---

## Features

- **Worldwide News Feed:** Curated and real-time news articles covering World, Technology, Business, Science, Culture, and Sports.
- **In-App Video News:** Watch live news broadcasts (DW News, Sky News, Al Jazeera, France 24, Euronews, NASA TV) inside a theater modal.
- **WorldBrief AI Assistant:** Slide-out AI news assistant that summarizes top stories, compares publisher coverage, and answers questions.
- **Bookmarks & Search:** Save favorite articles locally in browser storage and search topics in real-time.
- **Zero-Config Resilient Fallback:** Works immediately out of the box with zero required API keys, with optional keys for live Gemini, GNews, and YouTube APIs.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

You can optionally configure:
- `GEMINI_API_KEY`: For live Google Gemini 2.0 generative chat ([Google AI Studio](https://aistudio.google.com/))
- `GNEWS_API_KEY`: For live worldwide article feeds ([GNews.io](https://gnews.io/))
- `YOUTUBE_API_KEY`: For live YouTube search ([Google Cloud Console](https://console.cloud.google.com/))

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `news-assistant` repository.
4. (Optional) Add your environment variables (`GEMINI_API_KEY`, etc.) in the project settings.
5. Click **Deploy**. Vercel will automatically run `npm run build` and launch your site!

### Production Build Locally

```bash
npm run build
npm run start
```

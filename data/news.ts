// Curated editorial news and video repository for WorldBrief
// Used as real-time demonstration feed and graceful fallback when external API keys are optional.

export const categories = [
  "Top stories",
  "World",
  "Business",
  "Technology",
  "Science",
  "Culture",
  "Sports",
] as const;

export type NewsItem = {
  id: number | string;
  category: string;
  source: string;
  sourceUrl?: string;
  url?: string;
  age: string;
  readTime: string;
  isVideo: boolean;
  title: string;
  summary: string;
  image: string;
  country?: string;
  language?: string;
  publishedAt?: string;
};

export const newsItems: NewsItem[] = [
  {
    id: 1,
    category: "World",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com",
    url: "https://www.reuters.com/world/",
    age: "12m ago",
    publishedAt: "2026-10-22T15:30:00Z",
    readTime: "5 min",
    isVideo: false,
    title: "Global Climate and Energy Summit Concludes with Historic Grid Modernization Accord",
    summary: "Delegates from over 90 nations reached a landmark consensus in Geneva to fast-track cross-border renewable grid interconnections and energy resilience funding through 2030.",
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=85",
    country: "worldwide",
  },
  {
    id: 2,
    category: "Technology",
    source: "TechCrunch",
    sourceUrl: "https://techcrunch.com",
    url: "https://techcrunch.com/category/artificial-intelligence/",
    age: "24m ago",
    publishedAt: "2026-10-22T15:15:00Z",
    readTime: "4 min",
    isVideo: true,
    title: "Next-Generation Autonomous AI Agents Transition from Chatbots to Enterprise Execution",
    summary: "The latest benchmark evaluations demonstrate multi-modal reasoning models executing complex multi-step workflows, enterprise scheduling, and code refactoring with human oversight.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    country: "us",
  },
  {
    id: 3,
    category: "Business",
    source: "Bloomberg",
    sourceUrl: "https://www.bloomberg.com",
    url: "https://www.bloomberg.com/markets",
    age: "38m ago",
    publishedAt: "2026-10-22T15:00:00Z",
    readTime: "4 min",
    isVideo: false,
    title: "Global Markets Rally as Central Banks Signal Balanced Inflation and Steady Rates",
    summary: "Major equity indexes across New York, London, and Tokyo recorded steady gains following upbeat manufacturing numbers and stabilized supply chain transport indices.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    country: "us",
  },
  {
    id: 4,
    category: "Science",
    source: "Nature",
    sourceUrl: "https://www.nature.com",
    url: "https://www.nature.com/news",
    age: "1h ago",
    publishedAt: "2026-10-22T14:30:00Z",
    readTime: "6 min",
    isVideo: false,
    title: "Deep-Space Telescope Uncovers Atmospheric Water Vapor on Nearby Habitable-Zone Exoplanet",
    summary: "Spectroscopic readings from the latest orbital observatory confirmed high concentrations of atmospheric moisture and methane equilibrium on an exoplanet 48 light-years away.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    country: "worldwide",
  },
  {
    id: 5,
    category: "Sports",
    source: "BBC Sport",
    sourceUrl: "https://www.bbc.com/sport",
    url: "https://www.bbc.com/sport",
    age: "1h 15m ago",
    publishedAt: "2026-10-22T14:15:00Z",
    readTime: "3 min",
    isVideo: true,
    title: "Dramatic Stoppage-Time Thriller Decides Continental Champions League Quarterfinal",
    summary: "A 94th-minute curling volley ignited wild stadium celebrations as the underdogs secured their historic semifinal berth after trailing two goals down on aggregate.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    country: "gb",
  },
  {
    id: 6,
    category: "Culture",
    source: "The Guardian",
    sourceUrl: "https://www.theguardian.com",
    url: "https://www.theguardian.com/culture",
    age: "1h 45m ago",
    publishedAt: "2026-10-22T13:45:00Z",
    readTime: "5 min",
    isVideo: false,
    title: "Venice Biennale 2026 Showcases Digital Heritage and Sustainable Architecture",
    summary: "Architects and visual artists from 65 countries unveil interactive pavilions transforming reclaimed maritime materials into responsive urban living spaces.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    country: "worldwide",
  },
  {
    id: 7,
    category: "World",
    source: "Associated Press",
    sourceUrl: "https://apnews.com",
    url: "https://apnews.com/hub/world-news",
    age: "2h ago",
    publishedAt: "2026-10-22T13:30:00Z",
    readTime: "4 min",
    isVideo: false,
    title: "Regional Trade Alliance Expands High-Speed Freight Corridor Across Central Asia",
    summary: "New transit agreements eliminate border tariff friction and halve transit times for perishable goods moving between South Asia, the Middle East, and Mediterranean ports.",
    image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1200&q=80",
    country: "pk",
  },
  {
    id: 8,
    category: "Technology",
    source: "The Verge",
    sourceUrl: "https://www.theverge.com",
    url: "https://www.theverge.com/tech",
    age: "2h 30m ago",
    publishedAt: "2026-10-22T13:00:00Z",
    readTime: "4 min",
    isVideo: false,
    title: "Silicon Photonics Breakthrough Delivers 10x Bandwidth for Next-Gen Data Centers",
    summary: "Engineers have successfully manufactured integrated optical interconnects directly onto standard silicon wafers, dramatically slashing AI cluster power consumption.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    country: "us",
  },
  {
    id: 9,
    category: "Business",
    source: "Financial Times",
    sourceUrl: "https://www.ft.com",
    url: "https://www.ft.com",
    age: "3h ago",
    publishedAt: "2026-10-22T12:30:00Z",
    readTime: "5 min",
    isVideo: false,
    title: "Venture Investment in Clean Fusion and Advanced Geothermal Surpasses $15B in 2026",
    summary: "Private capital commitments to base-load carbon-free energy technologies reached record quarterly highs, fueled by rising demand from automated data centers.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    country: "gb",
  },
  {
    id: 10,
    category: "Science",
    source: "Scientific American",
    sourceUrl: "https://www.scientificamerican.com",
    url: "https://www.scientificamerican.com",
    age: "3h 20m ago",
    publishedAt: "2026-10-22T12:10:00Z",
    readTime: "4 min",
    isVideo: false,
    title: "CRISPR-Based Targeted Immunotherapy Achieves Remission in Rare Blood Disorders",
    summary: "Clinical phase-3 multi-center trial outcomes published today reveal durable disease-free survival rates in patients with previously treatment-resistant conditions.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    country: "worldwide",
  },
  {
    id: 11,
    category: "Sports",
    source: "ESPN",
    sourceUrl: "https://www.espn.com",
    url: "https://www.espn.com",
    age: "4h ago",
    publishedAt: "2026-10-22T11:30:00Z",
    readTime: "3 min",
    isVideo: false,
    title: "International Cricket Board Finalizes Host Venues for 2027 World Championship",
    summary: "Modernized stadiums across three continents will feature upgraded eco-friendly lighting, smart pitches, and real-time biometric fan telemetry.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    country: "in",
  },
  {
    id: 12,
    category: "World",
    source: "Dawn News",
    sourceUrl: "https://www.dawn.com",
    url: "https://www.dawn.com",
    age: "4h 30m ago",
    publishedAt: "2026-10-22T11:00:00Z",
    readTime: "4 min",
    isVideo: false,
    title: "National Digital Infrastructure Plan Connects 5,000 Remote Schools to Broadband",
    summary: "The Ministry of Information Technology inaugurated high-speed satellite fiber nodes across rural districts, providing millions of students with interactive STEM curricula.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    country: "pk",
  },
];

export type VideoItem = {
  id: number | string;
  videoId?: string;
  title: string;
  description?: string;
  channel: string;
  views: string;
  age: string;
  duration: string;
  image: string;
  url: string;
  publishedAt?: string;
};

export const videoItems: VideoItem[] = [
  {
    id: 1,
    videoId: "LuKwFajn37U",
    title: "DW News Live: Global Headlines & International Breaking Coverage",
    description: "24/7 global news broadcast from Deutsche Welle covering international politics, climate, and technology.",
    channel: "DW News",
    views: "2.1M",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/LuKwFajn37U/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=LuKwFajn37U",
  },
  {
    id: 2,
    videoId: "umLWFz4izTM",
    title: "Sky News Live: Breaking World News, Politics and In-Depth Reports",
    description: "Live news reporting from Sky News desks in London, Washington, and across the globe.",
    channel: "Sky News",
    views: "1.8M",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/umLWFz4izTM/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=umLWFz4izTM",
  },
  {
    id: 3,
    videoId: "gCNeDWCI0vo",
    title: "Al Jazeera English Live: Comprehensive Global News & Field Reports",
    description: "Independent broadcast journalism covering international affairs, humanitarian crises, and global policy.",
    channel: "Al Jazeera English",
    views: "3.4M",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/gCNeDWCI0vo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=gCNeDWCI0vo",
  },
  {
    id: 4,
    videoId: "HvZt-nh9sGg",
    title: "FRANCE 24 English: International Breaking News & Top Stories",
    description: "Continuous global news analysis and correspondents reporting from European and worldwide capitals.",
    channel: "FRANCE 24",
    views: "950K",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/HvZt-nh9sGg/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=HvZt-nh9sGg",
  },
  {
    id: 5,
    videoId: "pykpO5kQJ98",
    title: "Euronews Live: European Perspective on Global Affairs & Economics",
    description: "Live multilingual coverage of European Union policy, economy, energy, and international affairs.",
    channel: "Euronews",
    views: "820K",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/pykpO5kQJ98/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=pykpO5kQJ98",
  },
  {
    id: 6,
    videoId: "21X5lGlDOfg",
    title: "NASA TV: Live Earth Views from Space, Launches & Mission Coverage",
    description: "Official NASA broadcast featuring International Space Station live telemetry, astrophysics, and climate observation.",
    channel: "NASA",
    views: "5.2M",
    age: "Live Stream",
    duration: "LIVE",
    image: "https://img.youtube.com/vi/21X5lGlDOfg/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=21X5lGlDOfg",
  },
];

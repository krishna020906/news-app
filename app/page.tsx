'use client'
import React, { useState } from "react";

// Single-file React component styled with Tailwind CSS
// Drop this file into a Next.js / React project and import <NewsAppUI /> where you want it.

const sampleArticles = [
  {
    id: 1,
    source: "CNN Indonesia",
    title: "Cristiano Ronaldo Wants To Fight Lionel Messi again",
    summary:
      "The Messi—Ronaldo rivalry, or Ronaldo—Messi rivalry, is a media and fan-driven sporting rivalry in soccer...",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60",
    time: "5 hours ago",
    comments: 123,
    shares: 76,
    bias: { proA: 60, proB: 30, neutral: 10 },
  },
  {
    id: 2,
    source: "Tech Today",
    title: "OpenAI releases new summarization model",
    summary: "A new model for short, publisher-supplied summaries helps creators write concise headlines...",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=60",
    time: "2 days ago",
    comments: 12,
    shares: 4,
    bias: { proA: 5, proB: 3, neutral: 92 },
  },
];

function IconHome({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BiasMeter({ bias }) {
  const total = bias.proA + bias.proB + bias.neutral || 1;
  const pA = Math.round((bias.proA / total) * 100);
  const pB = Math.round((bias.proB / total) * 100);
  const pN = 100 - pA - pB;
  return (
    <div className="mt-3">
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
        <div style={{ width: `${pA}%` }} className="bg-rose-500" title={`Pro A ${pA}%`} />
        <div style={{ width: `${pN}%` }} className="bg-amber-400" title={`Neutral ${pN}%`} />
        <div style={{ width: `${pB}%` }} className="bg-sky-600" title={`Pro B ${pB}%`} />
      </div>
      <div className="flex text-xs text-slate-500 gap-2 mt-1">
        <span>Pro A {pA}%</span>
        <span>Neutral {pN}%</span>
        <span>Pro B {pB}%</span>
      </div>
    </div>
  );
}

function ArticleCard({ article, onOpen }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
      <div className="relative h-44 md:h-56 lg:h-44">
        <img src={article.image} alt="hero" className="object-cover w-full h-full" />
        <div className="absolute left-4 top-4 bg-white/80 backdrop-blur rounded-full px-3 py-1 text-xs font-medium">{article.source}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{article.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{article.summary}</p>

        <BiasMeter bias={article.bias} />

        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <div className="flex gap-4 items-center">
            <button className="flex items-center gap-2">👍 <span>{Math.floor(Math.random() * 200)}</span></button>
            <button className="flex items-center gap-2">💬 <span>{article.comments}</span></button>
            <span>· {article.time}</span>
          </div>
          <button onClick={() => onOpen(article)} className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm">Read</button>
        </div>
      </div>
    </article>
  );
}

export default function NewsAppUI() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top / Hero area */}
      <header className="bg-white sticky top-0 z-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-md bg-gray-100">
              <IconHome />
            </button>
            <div>
              <div className="text-sm text-slate-500">Rembang, Ind</div>
              <div className="font-semibold">Top Headlines</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find interesting news"
                className="w-96 pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IconSearch /></div>
            </div>
            <button className="px-3 py-2 rounded-md border">Search</button>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:block px-3 py-2 rounded-md bg-orange-500 text-white">Get Started</button>
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find interesting news" className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:outline-none" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><IconSearch /></div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: hero / featured on desktop */}
        <section className="hidden md:block md:col-span-1">
          <div className="rounded-2xl overflow-hidden shadow-md bg-white border border-slate-100">
            <img src={sampleArticles[0].image} alt="hero" className="object-cover h-48 w-full" />
            <div className="p-4">
              <h2 className="text-lg font-bold">News from around the world for you</h2>
              <p className="mt-2 text-slate-600 text-sm">Best time to read, take your time to read a little more of this world</p>
              <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full">Get Started</button>
            </div>
          </div>
        </section>

        {/* Center column: feed */}
        <section className="md:col-span-2 space-y-4">
          {/* Filter chips */}
          <div className="flex gap-2 items-center overflow-x-auto pb-2">
            {['All','Political','Sport','Technology','Local'].map((c) => (
              <button key={c} className="px-3 py-1 bg-white border rounded-full text-sm whitespace-nowrap">{c}</button>
            ))}
          </div>

          {/* Article list */}
          <div className="space-y-4">
            {sampleArticles.map((a) => (
              <ArticleCard key={a.id} article={a} onOpen={(art) => setSelected(art)} />
            ))}
          </div>
        </section>

        {/* Right column: recommendations */}
        <aside className="hidden md:block">
          <div className="rounded-2xl bg-white border p-4">
            <h3 className="font-semibold">Recommendation</h3>
            <p className="mt-2 text-sm text-slate-500">Personalized picks based on your interests</p>
            <div className="mt-4 space-y-3">
              {sampleArticles.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <img src={a.image} alt="mini" className="w-12 h-12 object-cover rounded-md" />
                  <div>
                    <div className="text-sm font-medium line-clamp-2">{a.title}</div>
                    <div className="text-xs text-slate-400">{a.source} · {a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:hidden bg-white rounded-3xl shadow-lg border border-slate-100 p-2 flex justify-between items-center">
        <button className="flex flex-col items-center text-slate-700 text-xs">
          <IconHome />
          Home
        </button>
        <button className="flex flex-col items-center text-slate-700 text-xs">
          🔔
          Alerts
        </button>
        <button className="flex flex-col items-center text-slate-700 text-xs">
          ➕
          Submit
        </button>
        <button className="flex flex-col items-center text-slate-700 text-xs">
          👤
          Profile
        </button>
      </nav>

      {/* Article modal / drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative max-w-3xl w-full md:rounded-2xl bg-white shadow-lg overflow-auto max-h-[90vh]">
            <img src={selected.image} alt="sel" className="object-cover w-full h-56" />
            <div className="p-6">
              <div className="text-sm text-slate-400">{selected.source} · {selected.time}</div>
              <h2 className="text-2xl font-bold mt-2">{selected.title}</h2>
              <p className="mt-4 text-slate-700">{selected.summary.repeat(6)}</p>
              <div className="mt-6">
                <BiasMeter bias={selected.bias} />
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 rounded-full bg-amber-400 text-white">Like</button>
                  <button className="px-4 py-2 rounded-full border">Comment</button>
                  <button className="px-4 py-2 rounded-full border">Share</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


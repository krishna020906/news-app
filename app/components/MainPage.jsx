// File: components/MainPage.jsx
'use client'
import React, { useState } from 'react';
import Header from './Header';
import FilterChips from './FilterChips';
import ArticleCard from './ArticleCard';
import Recommendation from './Recommendation';
import MobileNav from './MobileNav';
import ArticleModal from './ArticleModal';
import NewsFeed from './NewsFeed'



const sampleArticles = [
  {
    id: 1,
    source: 'CNN Indonesia',
    title: 'Cristiano Ronaldo Wants To Fight Lionel Messi again',
    summary:
      'The Messi—Ronaldo rivalry, or Ronaldo—Messi rivalry, is a media and fan-driven sporting rivalry in soccer...',
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=60',
    time: '5 hours ago',
    comments: 123,
    shares: 76,
    bias: { proA: 60, proB: 30, neutral: 10 },
  },
  {
    id: 2,
    source: 'Tech Today',
    title: 'OpenAI releases new summarization model',
    summary: 'A new model for short, publisher-supplied summaries helps creators write concise headlines...',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=60',
    time: '2 days ago',
    comments: 12,
    shares: 4,
    bias: { proA: 5, proB: 3, neutral: 92 },
  },
];

export default function MainPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="min-h-screen"
      style={{
        /* prefer --bg if present, otherwise fall back to --card-bg */
        background: 'var(--bg, var(--card-bg))',
        color: 'var(--text-title)'
      }}
    >
      <Header onSearch={(q) => setQuery(q)} />

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT SIDEBAR */}
        <section className="hidden md:block md:col-span-1">
          <div
            className="rounded-2xl overflow-hidden shadow-md"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)'
            }}
          >
            <img
              src={sampleArticles[0].image}
              alt="hero"
              className="object-cover h-48 w-full"
            />

            <div className="p-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-title)' }}>
                News from around the world for you
              </h2>

              <p className="mt-2 text-sm" style={{ color: 'var(--text-body)' }}>
                Best time to read, take your time to read a little more of this world
              </p>

              <button
                className="mt-4 px-4 py-2 rounded-full"
                style={{ background: 'var(--button-bg, var(--accent))', color: 'var(--button-text, white)' }}
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* MAIN FEED */}
        <section className="md:col-span-2 space-y-4">
          <FilterChips />

          <NewsFeed
            query={query}
            onOpen={(art) => setSelected(art)}
          />
        </section>

        {/* <section className="md:col-span-2 space-y-4">
          <FilterChips />

          <div className="space-y-4">
            {sampleArticles.map((a) => (
              <ArticleCard
                key={a.id}
                article={a}
                onOpen={(art) => setSelected(art)}
              />
            ))}
          </div>
        </section> */}

        {/* RIGHT SIDEBAR */}
        <aside className="hidden md:block">
          <Recommendation items={sampleArticles} />
        </aside>
      </main>

      <MobileNav />

      {selected && (
        <ArticleModal article={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

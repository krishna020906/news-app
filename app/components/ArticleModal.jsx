


// File: components/ArticleModal.jsx
import React from 'react';
import BiasMeter from './BiasMeter';

export default function ArticleModal({ article, onClose = () => {} }) {
  if (!article) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-3xl w-full md:rounded-2xl bg-white shadow-lg overflow-auto max-h-[90vh]">
        <img src={article.image} alt="sel" className="object-cover w-full h-56" />
        <div className="p-6">
          <div className="text-sm text-slate-400">{article.source} · {article.time}</div>
          <h2 className="text-2xl font-bold mt-2">{article.title}</h2>
          <p className="mt-4 text-slate-700">{article.summary.repeat(6)}</p>
          <div className="mt-6">
            <BiasMeter bias={article.bias} />
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded-full bg-amber-400 text-white">Like</button>
              <button className="px-4 py-2 rounded-full border">Comment</button>
              <button className="px-4 py-2 rounded-full border">Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



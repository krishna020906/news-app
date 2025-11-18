// File: components/ArticleModal.jsx
import React from 'react';
import BiasMeter from './BiasMeter';

export default function ArticleModal({ article, onClose = () => {} }) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Modal overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="relative max-w-3xl w-full md:rounded-2xl overflow-auto max-h-[90vh]"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)"
        }}
      >
        <img
          src={article.image}
          alt="sel"
          className="object-cover w-full h-56"
        />

        <div className="p-6">
          <div
            className="text-sm"
            style={{ color: "var(--text-body)" }}
          >
            {article.source} · {article.time}
          </div>

          <h2
            className="text-2xl font-bold mt-2"
            style={{ color: "var(--text-title)" }}
          >
            {article.title}
          </h2>

          <p
            className="mt-4"
            style={{ color: "var(--text-body)" }}
          >
            {article.summary.repeat(6)}
          </p>

          <div className="mt-6">
            <BiasMeter bias={article.bias} />

            <div className="mt-4 flex gap-3">
              <button
                className="px-4 py-2 rounded-full"
                style={{
                  background: "var(--button-bg)",
                  color: "var(--button-text)"
                }}
              >
                Like
              </button>

              <button
                className="px-4 py-2 rounded-full"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--text-title)"
                }}
              >
                Comment
              </button>

              <button
                className="px-4 py-2 rounded-full"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--text-title)"
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


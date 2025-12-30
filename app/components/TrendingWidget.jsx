import { useEffect, useState } from "react";

export default function TrendingWidget() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/news/trending")
      .then((res) => res.json())
      .then((data) => setItems(data.posts || []));
  }, []);

  return (
    <div className="bg-[#111] rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-3">🔥 Trending Now</h3>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item._id} className="flex gap-3 items-start">
            <span className="text-orange-400 font-bold text-lg">
              #{i + 1}
            </span>

            <div className="text-sm">
              <p className="font-medium line-clamp-2">
                {item.title}
              </p>
              <p className="text-xs text-gray-400">
                {item.views || 0} views · {item.commentsCount || 0} comments
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

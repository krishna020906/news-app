export default function StreakWidget({ streak = 0 }) {
  const STREAKS = [
    { label: "Starter", days: 3 },
    { label: "Builder", days: 7 },
    { label: "Consistent", days: 15 },
    { label: "Master", days: 30 },
  ];

  const current =
    STREAKS.find((s) => streak < s.days) || STREAKS[STREAKS.length - 1];

  const previous =
    STREAKS[STREAKS.indexOf(current) - 1] || { days: 0 };

  const progress =
    ((streak - previous.days) / (current.days - previous.days)) * 100;

  return (
    <div
      className="
        fixed bottom-6 right-6 z-50
        bg-[#111] text-white
        px-4 py-3 rounded-xl
        shadow-xl w-64
        border border-white/10
      "
    >
      <div className="flex items-center justify-between">
        <span className="text-sm opacity-80">🔥 Reading Streak</span>
        <span className="text-sm font-semibold">
          {streak} day{streak !== 1 && "s"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>{previous.days} days</span>
          <span>{current.days} days</span>
        </div>
      </div>
    </div>
  );
}









// import React from "react";

// const STREAK_LEVELS = [
//   { label: "Starter", days: 3 },
//   { label: "Builder", days: 7 },
//   { label: "Consistent", days: 15 },
//   { label: "Master", days: 30 },
// ];

// export default function StreakWidget({ streak = 0 }) {
//   // Find current milestone
//   const currentLevel =
//     STREAK_LEVELS.find((l) => streak < l.days) || STREAK_LEVELS.at(-1);

//   const prevLevel =
//     STREAK_LEVELS[STREAK_LEVELS.indexOf(currentLevel) - 1] || {
//       days: 0,
//     };

//   const progress =
//     ((streak - prevLevel.days) /
//       (currentLevel.days - prevLevel.days)) *
//     100;

//   return (
//     <div className="bg-[#111] text-white rounded-xl p-4 shadow-md  ">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm opacity-80">Daily Reading Streak</p>
//           <h2 className="text-xl font-semibold">
//             🔥 {streak} Day{streak !== 1 && "s"}
//           </h2>
//         </div>

//         <div className="text-right text-sm text-orange-400 font-semibold">
//           {currentLevel.label}
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="mt-3">
//         <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-gradient-to from-orange-400 to-yellow-400 transition-all duration-500"
//             style={{ width: `${Math.min(progress, 100)}%` }}
//           />
//         </div>

//         <div className="flex justify-between text-xs mt-1 text-gray-400">
//           <span>{prevLevel.days} days</span>
//           <span>{currentLevel.days} days</span>
//         </div>
//       </div>
//     </div>
//   );
// }










// export default function StreakWidget({ streak }) {
//   return (
//     <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-xl shadow-lg">
//       <div className="flex items-center gap-2">
//         <span className="text-2xl">🔥</span>
//         <div>
//           <div className="font-semibold">
//             {streak} Day Streak
//           </div>
//           <div className="text-xs opacity-80">
//             Keep reading to grow it!
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

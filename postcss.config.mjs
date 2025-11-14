// const config = {
//   plugins: {
//     "@tailwindcss/postcss": {},
//   },
// };

// export default config;

// postcss.config.mjs
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: {
    tailwindcss: tailwindcss(),
    autoprefixer: autoprefixer(),
  },
};


// tailwind.config.js
module.exports = {
   darkMode: "class", // NOT 'media'
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#facc15",
        accent: "#10b981",
        warning: "#f97316",
        danger: "#ef4444",
        neutral: "#f3f4f6",
        dark: "#1f2937",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

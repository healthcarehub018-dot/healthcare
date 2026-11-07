import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#242220",
        muted: "#545454",
        forest: "#112111",
        "forest-light": "#1B6549",
        sage: "#779D7C",
        accent: "#2E936F",
        cream: "#FAF9F7",
        medvi: {
          dark: "#104D38",
          forest: "#175840",
          sage: "#779B7C",
          soft: "#E9F1E8",
          cream: "#F8F9F6",
          text: "#242824",
          muted: "#6F7770",
          sand: "#F5EDE6",
          blue: "#EAF2F5",
          blush: "#F7EDF1",
          gold: "#C8AC72",
        },
      },
      fontFamily: {
        sans: [
          '"Red Hat Text"',
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: ['"Red Hat Text"', "system-ui", "sans-serif"],
        eyebrow: ['"Onest"', '"Red Hat Text"', "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      maxWidth: {
        medvi: "1280px",
        content: "1120px",
        feature: "1060px",
        copy: "600px",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
export default config;

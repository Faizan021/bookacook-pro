import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },

        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          gold: "var(--accent-gold)",
        },

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        "surface-dark": "var(--surface-dark)",
        "surface-dark-mid": "var(--surface-dark-mid)",
        "surface-dark-card": "var(--surface-dark-card)",
        "surface-dark-foreground": "var(--surface-dark-foreground)",
        "surface-dark-muted": "var(--surface-dark-muted)",
        "surface-dark-border": "var(--surface-dark-border)",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
      },

      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        dark: "var(--shadow-dark)",
      },
    },
  },
  plugins: [],
};

export default config;

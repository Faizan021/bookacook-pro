import type { Config } from "tailwindcss";

const config: Config = {
  // 1. This tells Tailwind where to look for your classes
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 2. This maps your CSS Variables to Tailwind Classes
      colors: {
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        "accent-gold": "var(--accent-gold)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        "muted": "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        "popover": "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        "border": "var(--border)",
        "input": "var(--input)",
        "ring": "var(--ring)",
        surface: {
          dark: "var(--surface-dark)",
          "dark-mid": "var(--surface-dark-mid)",
          "dark-card": "var(--surface-dark-card)",
          foreground: "var(--surface-dark-foreground)",
          muted: "var(--surface-dark-muted)",
          border: "var(--surface-dark-border)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;

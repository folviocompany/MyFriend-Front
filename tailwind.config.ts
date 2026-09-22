const config = {
  theme: {
    extend: {
      colors: {
        "bg-dark": "rgb(var(--bg-dark) / <alpha-value>)",
        "bg-darker": "rgb(var(--bg-darker) / <alpha-value>)",
        "bg-sidebar": "rgb(var(--bg-sidebar) / <alpha-value>)",
        "bg-input": "rgb(var(--bg-input) / <alpha-value>)",
        "border-dim": "rgb(var(--border-dim) / <alpha-value>)",
        "accent-green": "rgb(var(--accent-green) / <alpha-value>)",
        "accent-cyan": "rgb(var(--accent-cyan) / <alpha-value>)",
        "accent-error": "rgb(var(--accent-error) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-accent": "rgb(var(--accent-green) / <alpha-value>)",
        "text-info": "rgb(var(--accent-cyan) / <alpha-value>)",
        "text-error": "rgb(var(--accent-error) / <alpha-value>)",
        "text-success": "rgb(var(--text-success) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "sans-serif"],
        mono: [
          "var(--font-jetbrains-mono)",
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      animation: {
        "message-in": "message-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "toast-in": "toast-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "dot-pulse": "dot-pulse 1.2s ease-in-out infinite",
      },
      keyframes: {
        "message-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dot-pulse": {
          "0%, 60%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "30%": { opacity: "1", transform: "translateY(-4px)" },
        },
      },
    },
  },
};

export default config;

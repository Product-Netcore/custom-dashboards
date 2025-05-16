/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'netcore-blue': '#143F93',
        'netcore-bg': '#f4f8ff',
        'netcore-nav-bg': '#F8F8F8',
        'netcore-nav-text': '#17173A',
        'netcore-nav-active': '#E6F0FF',
        'netcore-nav-icon': '#17173A',
        'netcore-sidebar-title': '#17173A',
        'netcore-sidebar-link': '#17173A',
        'netcore-sidebar-link-hover': '#E6F0FF',
        'netcore-sidebar-icon': '#6F6F8D',
        'netcore-sidebar-section-text': '#6F6F8D',
        'netcore-sidebar-add': '#143F93',
        'netcore-sidebar-minimize': '#6F6F8D',
        'netcore-chart-bg': '#FFFFFF',
        'netcore-chart-border': '#DDE2EE',
        'netcore-chart-title': '#000000',
        'netcore-chart-dropdown-bg': '#F8F8F8',
        'netcore-chart-dropdown-text': '#6F6F8D',
        'netcore-chart-menu-icon': '#6F6F8D',
        'netcore-chart-menu-item': '#17173A',
        'netcore-chart-menu-item-hover-bg': '#F4F8FF',
        'netcore-chart-menu-item-danger': '#F05C5C',
        'netcore-chart-menu-item-danger-hover-bg': '#FFF5F5',
        'netcore-chart-footer-text': '#6F6F8D',
        'netcore-chart-footer-link': '#143F93',
        'netcore-save-blue': '#007bff', // Existing blue, might need update
        'cobalt-blue': '#143F93', // Added Cobalt Blue
        'profile-yellow': '#FFD700',
        'accent-orange': '#FFA500',
        'menu-item-hover-bg': '#F4F8FF',
        'menu-item-border': '#DDE2EE',
        'charcoal': '#17173A',
        'soft-blue-shadow': '#DBE7FF',
      },
      borderRadius: {
        // ... existing code ...
      },
    },
  },
} 
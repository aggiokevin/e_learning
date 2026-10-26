/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* === EXISTANT (NE PAS TOUCHER) === */
        primary: {
  50:  'hsl(220 70% 95%)',
  100: 'hsl(220 70% 90%)',
  200: 'hsl(220 70% 80%)',
  300: 'hsl(220 70% 70%)',
  400: 'hsl(220 70% 60%)',
  500: 'hsl(220 70% 45%)', // <-- correspond exactement à --primary
  600: 'hsl(220 70% 40%)',
  700: 'hsl(220 70% 32%)',
  800: 'hsl(220 70% 25%)',
  900: 'hsl(220 70% 18%)',
},

        coral: {
  400: 'hsl(18 85% 65%)',
  500: 'hsl(18 85% 60%)', // <-- correspond à --secondary
  600: 'hsl(18 85% 50%)',
},
secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        /* === AJOUTS NÉCESSAIRES (design system CSS) === */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',

        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',

        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}

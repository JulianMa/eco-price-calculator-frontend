module.exports = {
  purge: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      textColor: {
        DEFAULT: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        error: 'var(--color-text-error)',
        warning: 'var(--color-text-warning)',
        success: 'var(--color-text-success)',
      },
      bgColor: {
        primary: {
          DEFAULT: 'var(--color-bg-primary)',
          hover: 'var(--color-bg-primary-hover)',
          overlay: 'var(--color-bg-primary-overlay)',
        },
        secondary: {
          DEFAULT: 'var(--color-bg-secondary)',
          hover: 'var(--color-bg-secondary-hover)',
        },
        error: 'var(--color-bg-error)',
        warning: 'var(--color-bg-warning)',
        success: 'var(--color-bg-success)',
      },
      borderColor: {
        primary: 'var(--color-border-primary)',
        hover: 'var(--color-border-hover)',
        error: 'var(--color-border-error)',
        warning: 'var(--color-border-warning)',
        success: 'var(--color-border-success)',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [],
};

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './admin/index.html',
    './App.tsx',
    './index.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  safelist: [
    'font-apple',
    'font-dmsans',
    'font-figtree',
    'font-geist',
    'font-ibmplex',
    'font-sans',
    'font-librefranklin',
    'font-manrope',
    'font-monasans',
    'font-plusjakarta',
    'font-publicsans',
    'font-schibsted',
    'font-splinesans',
    'font-stacksans',
    'font-serif',
    'font-mono'
  ],
  theme: {
    extend: {
      fontFamily: {
        apple: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif'],
        figtree: ['Figtree', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        ibmplex: ['IBM Plex Sans', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        librefranklin: ['Libre Franklin', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        monasans: ['Mona Sans', 'sans-serif'],
        plusjakarta: ['Plus Jakarta Sans', 'sans-serif'],
        publicsans: ['Public Sans', 'sans-serif'],
        schibsted: ['Schibsted Grotesk', 'sans-serif'],
        splinesans: ['Spline Sans', 'sans-serif'],
        stacksans: ['Stack Sans Text', 'sans-serif'],
        serif: ['Times New Roman', 'serif'],
        mono: ['Courier New', 'monospace']
      }
    }
  }
};

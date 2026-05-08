import spartanPreset from '@spartan-ng/brain/hlm-tailwind-preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  presets: [spartanPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
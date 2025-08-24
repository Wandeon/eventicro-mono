/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: { card: '0 4px 18px rgba(0,0,0,.2)' },
			colors: { brand: '#22d3ee', 'brand-dark': '#0891b2' }
		}
	},
	plugins: []
};

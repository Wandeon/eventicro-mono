/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: { DEFAULT: '#22d3ee', dark: '#0891b2' }
			},
			boxShadow: {
				card: '0 4px 18px rgba(0,0,0,.2)'
			}
		}
	},
	plugins: []
};

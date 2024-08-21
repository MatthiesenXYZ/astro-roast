import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';
import { defineConfig, presetTypography, presetUno, presetWebFonts, presetWind } from 'unocss';

export default defineConfig({
	shortcuts: {
		'web-frame': 'max-sm:px-4 sm:px-8 md:px-32 lg:px-64',
	},
	presets: [
		presetUno(),
		presetWind(),
		presetTypography(),
		presetDaisy({
			themes: ['dark'],
		}),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: [
					{
						name: 'Poppins',
						weights: ['400', '700'],
					},
				],
			},
		}),
	],
});

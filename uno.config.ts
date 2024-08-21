import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';
import { defineConfig, presetTypography, presetUno, presetWebFonts, presetWind } from 'unocss';

export default defineConfig({
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

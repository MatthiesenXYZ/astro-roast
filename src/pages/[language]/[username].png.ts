import type { APIContext, APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { decode } from 'html-entities';
import { html } from 'satori-html';
import { FONTS } from '../../../consts';
import OGImageTemplate from '../../components/OGImageTemplate.astro';
import { satoriAstroOG } from '../../lib/satoriOG';
import { languages } from '../../lib/supportedLanguages';
import { getPublicFonts } from '../../lib/utils';

// Get the OG image fonts
const { OG_IMAGE } = FONTS;

// Define the GET API route
export const GET: APIRoute = async (context: APIContext): Promise<Response> => {
	// Build Astro ContainerAPI
	const astroContainer = await AstroContainer.create();

	// Get the username and language from the request
	const { username, language } = context.params;

	// Validate username and language
	if (!username || !language) {
		return new Response(JSON.stringify({ error: 'Missing username or language' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	// Check if the language is supported
	if (languages[language] === undefined || languages[language] === null) {
		return new Response(JSON.stringify({ error: `Language "${language}" is not yet supported.` }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}

	// Generate the image using Satori and return it
	return await satoriAstroOG({
		template: html(
			decode(
				await astroContainer.renderToString(OGImageTemplate, { props: { username, language } })
			)
		),
		width: 1920,
		height: 1080,
	}).toResponse({
		satori: {
			fonts: [
				{
					name: 'Poppins',
					data: await getPublicFonts(context.url.origin, OG_IMAGE.NORMAL),
					style: 'normal',
					weight: 400,
				},
				{
					name: 'Poppins',
					data: await getPublicFonts(context.url.origin, OG_IMAGE.BOLD),
					style: 'normal',
					weight: 700,
				},
			],
		},
	});
};

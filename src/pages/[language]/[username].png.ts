import type { APIContext, APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import OGImageTemplate from "../../components/OGImageTemplate.astro";
import { satoriAstroOG } from "../../lib/satoriOG";
import { html } from "satori-html";
import { decode } from 'html-entities';
import { languages } from "../../lib/supportedLanguages";

export const GET: APIRoute = async ( context: APIContext ): Promise<Response> => {

    // Build Astro ContainerAPI
    const astroContainer = await AstroContainer.create();

    // Get the username and language from the request
    const { username, language } = context.params;

    // Validate username and language
    if (!username || !language) {
        return new Response(JSON.stringify({ error: 'Missing username or language' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    if ( languages[language] === undefined || languages[language] === null ) {
        throw new Error(`Language "${language}" is not yet supported.`);
    }

    // Create the html template for the image
    const OGImageTemplateContainer = await astroContainer.renderToString(OGImageTemplate, { props: { username, language } });

    const poppinsNormalFile = await fetch(new URL("/fonts/poppins-regular.ttf", context.url.origin))
    const poppinsNormalData = await poppinsNormalFile.arrayBuffer();
    const poppinsBoldFile = await fetch(new URL("/fonts/poppins-bold.ttf", context.url.origin))
    const poppinsBoldData = await poppinsBoldFile.arrayBuffer();

    // Generate the image using Satori
    return await satoriAstroOG({
        template: html(decode(OGImageTemplateContainer)),
        width: 1920,
        height: 1080,
    })
    .toResponse({
        satori: {
            fonts: [
                {
                    name: 'Poppins',
                    data: poppinsNormalData,
                    style: 'normal',
                    weight: 400,
                },
                {
                    name: 'Poppins',
                    data: poppinsBoldData,
                    style: 'normal',
                    weight: 700,
                },
            ],
        },
    })
}
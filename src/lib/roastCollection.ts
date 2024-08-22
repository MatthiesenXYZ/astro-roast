import { RoastCollection, and, db, eq } from 'astro:db';
import { languages } from './supportedLanguages';

// Get the Previous Roasts by language
const roastsByLanguage = async (language: string) => {
	return (
		await db.select().from(RoastCollection).where(eq(RoastCollection.language, language))
	).sort(
		({ createdAt: start }, { createdAt: end }) =>
			new Date(end).getTime() - new Date(start).getTime()
	);
};

// Get the last roast by language
const lastRoastByLanguage = async (language: string) => {
	const roasts = await roastsByLanguage(language);
	return roasts[0];
};

// Function to get roasts
export const getRoasts = async () => {
	return {
		allRoasts: async () => {
			return (await db.select().from(RoastCollection)).sort(
				({ createdAt: start }, { createdAt: end }) =>
					new Date(end).getTime() - new Date(start).getTime()
			);
		},
		last15Roasts: async () => {
			return (await db.select().from(RoastCollection))
				.sort(
					({ createdAt: start }, { createdAt: end }) =>
						new Date(end).getTime() - new Date(start).getTime()
				)
				.slice(0, 15);
		},
		lastRoast: async () => {
			return (await db.select().from(RoastCollection)).sort(
				({ createdAt: start }, { createdAt: end }) =>
					new Date(end).getTime() - new Date(start).getTime()
			)[0];
		},
		roastSelect: async (username: string, language: string) => {
			return await db
				.select()
				.from(RoastCollection)
				.where(and(eq(RoastCollection.username, username), eq(RoastCollection.language, language)))
				.get();
		},
		byLanguage(language: string) {
			return roastsByLanguage(language);
		},
		lastByLanguage(language: string) {
			return lastRoastByLanguage(language);
		},
	};
};

// Function to make a roast description for OG Links
export const makeDescription = (roast?: {
	username: string;
	language: string;
	response: string;
	createdAt: Date;
}) => {
	if (!roast) return 'Get Roasted!';

	return `${roast.username} (${languages[roast.language].name}): "${roast.response.slice(0, 150).trimEnd()}...." — All roasts are only meant for fun! And should not be taken seriously.`;
};

// Function to get the OG image path
export const getOgImagePath = (roast?: {
	username: string;
	language: string;
	response: string;
	createdAt: Date;
}) => {
	if (!roast) return '';

	return `${roast.language}/${roast.username}.png`;
};

// Function to get the path
export const getRoastPath = (roast?: {
	username: string;
	language: string;
	response: string;
	createdAt: Date;
}) => {
	if (!roast) return '#';

	return `/${roast.language}/${roast.username}`;
};

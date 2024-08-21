import { RoastCollection, and, db, eq } from 'astro:db';

// Get the Previous Roasts from the database
const previousRoasts = await db.select().from(RoastCollection);

// Sort the previous roasts by createdAt date
const sorted = previousRoasts.sort(
	({ createdAt: start }, { createdAt: end }) => new Date(end).getTime() - new Date(start).getTime()
);

// Get the latest 15 roasts
const latestRoasts = sorted.slice(0, 15);

// Get the last roast
const lastRoast = latestRoasts.length > 0 ? latestRoasts[0] : undefined;

// Function to get roasts
export const getRoasts = async () => {
	return {
		allRoasts: sorted || [],
		last15Roasts: latestRoasts,
		lastRoast: lastRoast,
		roastSelect: async (username: string, language: string) => {
			return await db
				.select()
				.from(RoastCollection)
				.where(and(eq(RoastCollection.username, username), eq(RoastCollection.language, language)))
				.get();
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

	return `Get Roasted!\n\n${roast.username} (${roast.language}) says: "${roast.response}"\n\nThis roast was created on ${new Date(roast.createdAt).toLocaleDateString()}. (Roasts are meant for fun! and should not be taken seriously.)`;
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

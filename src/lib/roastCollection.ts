import { and, db, eq, RoastCollection } from "astro:db";

const previousRoasts = await db.select().from(RoastCollection)

const sorted = previousRoasts.sort(({ createdAt: start }, { createdAt: end }) => new Date(end).getTime() - new Date(start).getTime());

const latestRoasts = sorted.slice(0, 14);

const lastRoast = latestRoasts.length > 0 ? latestRoasts[0] : undefined;

export const getRoasts = async () => {
    return {
        allRoasts: sorted || [],
        last15Roasts: latestRoasts,
        lastRoast: lastRoast,
        roastSelect: async (username: string, language: string) => {
            return await db.select().from(RoastCollection).where(and(eq(RoastCollection.username, username), eq(RoastCollection.language, language))).get();
        }
    }
}

export const makeDescription = (roast?: { username: string; language: string; response: string; createdAt: Date; } ) => {
    if (!roast) return 'Get Roasted!';

    return `Get Roasted!\n\n${roast.username} (${roast.language}) says: "${roast.response}"\n\nThis roast was created on ${new Date(roast.createdAt).toLocaleDateString()}. (Roasts are meant for fun! and should not be taken seriously.)`;
};

export const getOgImagePath = (roast?: { username: string; language: string; response: string; createdAt: Date; }) => {
    if (!roast) return '';

    return `${roast.language}/${roast.username}.png`;
}
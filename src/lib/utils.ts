// This function fetches a font file from a given base URL and path, and returns it as an ArrayBuffer.
export const getPublicFonts = async (base: string, path: string) => {
    return await (await fetch(new URL(path, base))).arrayBuffer();
}